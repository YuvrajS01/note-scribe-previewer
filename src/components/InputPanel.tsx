import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InputPanelProps {
  onAddContent: (topic: string, notes: string, images?: string[]) => void;
}

export const InputPanel = ({ onAddContent }: InputPanelProps) => {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
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

  return (
    <div className="app-panel p-6 h-fit">
      <h3 className="text-lg font-semibold text-foreground mb-6">Add New Content</h3>
      
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
    </div>
  );
};