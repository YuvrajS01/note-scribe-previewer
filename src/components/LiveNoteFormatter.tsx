import { useState } from 'react';
import { ContentBlock } from './ContentBlock';
import { InputPanel } from './InputPanel';
import { LivePreview } from './LivePreview';
import { DocumentOutline } from './DocumentOutline';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const LiveNoteFormatter = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [fontSize, setFontSize] = useState(9); // Default 9pt
  const [lineGap, setLineGap] = useState(4); // px
  const [paragraphGap, setParagraphGap] = useState(12); // px
  const [leftColumnGap, setLeftColumnGap] = useState(12); // px
  const [rightColumnGap, setRightColumnGap] = useState(12); // px
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
    // Select the first visible .a4-paper element
    const previewElements = document.querySelectorAll('.a4-paper');
    let previewElement: HTMLElement | null = null;
    for (const el of previewElements) {
      const htmlEl = el as HTMLElement;
      const style = window.getComputedStyle(htmlEl);
      if (style.display !== 'none' && style.visibility !== 'hidden' && htmlEl.offsetParent !== null) {
        previewElement = htmlEl;
        break;
      }
    }
    if (!previewElement) {
      toast({
        title: "PDF Error",
        description: "A4 paper preview not found or not visible. PDF export failed.",
        variant: "destructive",
      });
      return;
    }
    // Check if previewElement has content
    if (!previewElement.innerHTML.trim()) {
      toast({
        title: "PDF Error",
        description: "No content to export. Please add some notes before downloading.",
        variant: "destructive",
      });
      return;
    }
    // Wait for all images to load before capturing
    const images = previewElement.querySelectorAll('img');
    await Promise.all(Array.from(images).map(img => {
      const image = img as HTMLImageElement;
      if (image.complete) return Promise.resolve();
      return new Promise(resolve => {
        image.onload = image.onerror = resolve;
      });
    }));
    try {
      const canvas = await html2canvas(previewElement, { scale: 2, useCORS: true, allowTaint: true });
      const a4Width = 794;
      const a4Height = 1123;
      const imgWidth = a4Width;
      const imgHeight = Math.round(canvas.height * (a4Width / canvas.width));
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [a4Width, a4Height] });
      let position = 0;
      let pageCount = 1;
      while (position < imgHeight) {
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0 - position,
          imgWidth,
          imgHeight
        );
        position += a4Height;
        if (position < imgHeight) {
          pdf.addPage([a4Width, a4Height], 'portrait');
          pageCount++;
        }
      }
      // Remove last page if it is blank (i.e., if the last page is empty due to overshooting)
      if (pageCount > 1 && position - a4Height >= imgHeight) {
        pdf.deletePage(pageCount);
      }
      pdf.save("notes.pdf");
      toast({
        title: "PDF Downloaded",
        description: "Your A4 preview has been exported as a sharp PDF.",
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      toast({
        title: "PDF Error",
        description: `Failed to generate PDF: ${err?.message || err}`,
        variant: "destructive",
      });
    }
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
            <LivePreview blocks={blocks} fontSize={fontSize} lineGap={lineGap} paragraphGap={paragraphGap} leftColumnGap={leftColumnGap} rightColumnGap={rightColumnGap} />
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
          <LivePreview blocks={blocks} fontSize={fontSize} lineGap={lineGap} paragraphGap={paragraphGap} leftColumnGap={leftColumnGap} rightColumnGap={rightColumnGap} />
        </div>
      </main>
    </div>
  );
};