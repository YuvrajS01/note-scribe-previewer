import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Download } from 'lucide-react';
import { ContentBlock } from './ContentBlock';

interface DocumentOutlineProps {
  blocks: ContentBlock[];
  onDeleteBlock: (id: string) => void;
  onDownloadPdf: () => void;
}

export const DocumentOutline = ({ blocks, onDeleteBlock, onDownloadPdf }: DocumentOutlineProps) => {
  return (
    <div className="app-panel p-6 flex flex-col h-fit">
      <h3 className="text-lg font-semibold text-foreground mb-4">Document Content</h3>
      
      <ScrollArea className="flex-1 max-h-[400px] mb-4">
        {blocks.length === 0 ? (
          <div className="text-muted-foreground text-center py-8">
            <p className="text-sm">No content blocks yet</p>
            <p className="text-xs mt-1">Add your first topic to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {blocks.map((block, index) => (
              <div
                key={block.id}
                className="flex items-start justify-between p-3 rounded-md border bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {index + 1}. {block.topic}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {block.notes}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteBlock(block.id)}
                  className="ml-2 h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <Button
        onClick={onDownloadPdf}
        disabled={blocks.length === 0}
        className="w-full"
        variant="default"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Final PDF
      </Button>
    </div>
  );
};