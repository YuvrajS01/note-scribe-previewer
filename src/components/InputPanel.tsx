import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface InputPanelProps {
  onAddContent: (topic: string, notes: string) => void;
}

export const InputPanel = ({ onAddContent }: InputPanelProps) => {
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && notes.trim()) {
      onAddContent(topic.trim(), notes.trim());
      setTopic('');
      setNotes('');
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
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your detailed notes here..."
            className="w-full min-h-[120px] resize-y"
          />
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