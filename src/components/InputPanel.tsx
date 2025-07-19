import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface InputPanelProps {
  onAddContent: (topic: string, notes: string, images?: string[]) => void;
}

export const InputPanel = ({ onAddContent }: InputPanelProps) => {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList) => {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (validImageTypes.includes(file.type)) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast({
            title: "File too large",
            description: `${file.name} is larger than 5MB`,
            variant: "destructive",
          });
          continue;
        }
        try {
          const base64 = await convertFileToBase64(file);
          newImages.push(base64);
        } catch (error) {
          toast({
            title: "Error processing file",
            description: `Could not process ${file.name}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported image format`,
          variant: "destructive",
        });
      }
    }

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      toast({
        title: "Images added",
        description: `${newImages.length} image(s) added to your notes`,
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && notes.trim()) {
      onAddContent(topic.trim(), notes.trim(), images.length > 0 ? images : undefined);
      setTopic('');
      setNotes('');
      setImages([]);
    }
  };

  // Use backend proxy for Gemini API
  const fetchAiAnswers = async (questions: string) => {
    setAiLoading(true);
    // Format prompt: join all questions/topics into a single prompt
    const topics = questions.split('\n').map(q => q.trim()).filter(Boolean);
    if (topics.length === 0) {
      setAiLoading(false);
      return [];
    }
    // Use a unique delimiter to separate answers
    const delimiter = '###';
    const prompt = `For each of the following questions/topics, return ONLY the answer, nothing else. Each answer must be a single paragraph of about 10 lines with all the necessary keywords for the question/topic mentioned. If an answer must have multiple paragraphs, separate paragraphs with '--' (double dash) and NOT a new line. The number of answers in your response MUST match the number of questions, and answers must be in the same order as the questions. Do not include any preamble, explanation, or numbering. Just output the answers, one after another, separated by the string '${delimiter}'. Here are the questions:\n\n${topics.map((t, i) => (i+1)+'. '+t).join('\\n')}`;
    try {
      // Always use relative path for Vite proxy
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        })
      });
      if (!res.ok) {
        // Try to log error details from the proxy
        let errMsg = `Gemini API error: ${res.status}`;
        try {
          const errData = await res.json();
          errMsg += ` - ${errData.error || JSON.stringify(errData)}`;
        } catch {}
        throw new Error(errMsg);
      }
      const data = await res.json();
      // Debug Gemini response
      console.log('Gemini API raw response:', data);
      const answerText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      console.log('Gemini answerText:', answerText);
      // Parse Gemini response: split by delimiter
      let answerBlocks = answerText.split(delimiter).map(s => s.trim()).filter(Boolean);
      // Remove any leading numbering or question text from each answer
      answerBlocks = answerBlocks.map(ans => ans.replace(/^\d+\.?\s*/, ''));
      // If only one answer is returned for multiple topics, duplicate it
      if (answerBlocks.length === 1 && topics.length > 1) {
        answerBlocks = Array(topics.length).fill(answerBlocks[0]);
      }
      // If Gemini returns more answers than topics, trim extra answers
      if (answerBlocks.length > topics.length) {
        answerBlocks = answerBlocks.slice(0, topics.length);
      }
      // Map answers back to topics
      const aiBlocks = topics.map((topic, i) => ({
        topic,
        notes: answerBlocks[i] ? answerBlocks[i] : "(No answer returned)",
        images: [],
      }));
      setAiLoading(false);
      return aiBlocks;
    } catch (err: any) {
      setAiLoading(false);
      toast({
        title: "Gemini API Error",
        description: err.message || "Failed to fetch AI answers.",
        variant: "destructive",
      });
      // Also log error to console for devs
      console.error('Gemini fetch error:', err);
      return [];
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setAiLoading(true);
    const aiBlocks = await fetchAiAnswers(aiInput);
    aiBlocks.forEach(block => onAddContent(block.topic, block.notes, block.images));
    setAiInput('');
    setAiLoading(false);
    toast({
      title: "AI Content Added",
      description: `${aiBlocks.length} topic(s) generated and added to your notes.`,
    });
  };

  return (
    <div className="app-panel p-6 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Add New Content</h3>
        <div className="flex items-center gap-2">
          <Switch checked={aiMode} onCheckedChange={setAiMode} id="ai-toggle" />
          <Label htmlFor="ai-toggle" className="text-sm">Make with AI</Label>
        </div>
      </div>
      {aiMode ? (
        <form onSubmit={handleAiSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ai-input">Enter a list of questions/topics (one per line)</Label>
            <Textarea
              id="ai-input"
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              placeholder="e.g. What is a Bayesian Network?\nExplain Markov Chains\n..."
              className="w-full min-h-[120px] resize-y"
              disabled={aiLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={aiLoading || !aiInput.trim()}>
            {aiLoading ? 'Generating...' : 'Generate & Add to Document'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic / Question</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., What is a Bayesian Network?"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Answer</Label>
            <div 
              className={`relative border-2 border-dashed rounded-md transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your detailed notes here... (You can drag & drop images here)"
                className="w-full min-h-[120px] resize-y border-0 focus-visible:ring-0"
              />
              {dragActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-md">
                  <p className="text-primary font-medium">Drop images here</p>
                </div>
              )}
            </div>
            
            {/* Image Upload Button */}
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Add Images
              </Button>
              <span className="text-xs text-muted-foreground">
                Drag & drop or click to add images (PNG, JPG, GIF, WebP, max 5MB)
              </span>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            
            {/* Image Preview */}
            {images.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm">Attached Images</Label>
                <div className="grid grid-cols-2 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={image} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!topic.trim() || !notes.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Document
          </Button>
        </form>
      )}
    </div>
  );
};