import { useState } from 'react';
import { ContentBlock } from './ContentBlock';
import { InputPanel } from './InputPanel';
import { LivePreview } from './LivePreview';
import { DocumentOutline } from './DocumentOutline';
import { useToast } from '@/hooks/use-toast';

export const LiveNoteFormatter = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [fontSize, setFontSize] = useState(9); // Default 9pt
  const { toast } = useToast();

  const addContent = (topic: string, notes: string, images?: string[]) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      topic,
      notes,
      images,
      createdAt: new Date(),
    };
    
    setBlocks(prev => [...prev, newBlock]);
    
    toast({
      title: "Content added",
      description: "Your content block has been added to the document.",
    });
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
    
    toast({
      title: "Content removed",
      description: "The content block has been removed from your document.",
      variant: "destructive",
    });
  };

  const downloadPdf = async () => {
    // For now, we'll show a toast. PDF generation will be implemented later
    toast({
      title: "PDF Generation",
      description: "PDF download functionality will be implemented in the next iteration.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Live Note Formatter</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create beautifully formatted study notes with real-time PDF preview
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Desktop Three-Panel Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6">
          {/* Input Panel - 25% */}
          <div className="col-span-3">
            <InputPanel onAddContent={addContent} />
          </div>
          
          {/* Live Preview Panel - 50% */}
          <div className="col-span-6">
            <LivePreview blocks={blocks} fontSize={fontSize} />
          </div>
          
          {/* Document Outline Panel - 25% */}
          <div className="col-span-3">
            <DocumentOutline 
              blocks={blocks}
              onDeleteBlock={deleteBlock}
              onDownloadPdf={downloadPdf}
              fontSize={fontSize}
              onFontSizeChange={setFontSize}
            />
          </div>
        </div>

        {/* Mobile/Tablet Vertical Layout */}
        <div className="lg:hidden space-y-6">
          {/* Input Controls */}
          <InputPanel onAddContent={addContent} />
          
          {/* Document Outline */}
          <DocumentOutline 
            blocks={blocks}
            onDeleteBlock={deleteBlock}
            onDownloadPdf={downloadPdf}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
          />
          
          {/* Live Preview */}
          <LivePreview blocks={blocks} fontSize={fontSize} />
        </div>
      </main>
    </div>
  );
};