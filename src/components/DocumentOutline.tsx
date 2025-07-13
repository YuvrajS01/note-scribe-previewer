import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Trash2, Download, Type } from 'lucide-react';
import { ContentBlock } from './ContentBlock';

interface DocumentOutlineProps {
  blocks: ContentBlock[];
  onDeleteBlock: (id: string) => void;
  onDownloadPdf: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

export const DocumentOutline = ({ blocks, onDeleteBlock, onDownloadPdf, fontSize, onFontSizeChange }: DocumentOutlineProps) => {
  return (
    <div className="app-panel p-6 flex flex-col h-fit">
      <h3 className="text-lg font-semibold text-foreground mb-4">Document Content</h3>
      
      {/* Font Size Control */}
      <div className="mb-4 space-y-2">
        <Label htmlFor="font-size" className="text-sm font-medium flex items-center gap-2">
          <Type className="w-4 h-4" />
          Font Size
        </Label>
        <Select value={fontSize.toString()} onValueChange={(value) => onFontSizeChange(Number(value))}>
          <SelectTrigger id="font-size" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4pt - Tiny</SelectItem>
            <SelectItem value="5">5pt - XXS</SelectItem>
            <SelectItem value="6">6pt - XS</SelectItem>
            <SelectItem value="7">7pt - Extra Small</SelectItem>
            <SelectItem value="8">8pt - Small</SelectItem>
            <SelectItem value="9">9pt - Default</SelectItem>
            <SelectItem value="10">10pt - Medium</SelectItem>
            <SelectItem value="11">11pt - Large</SelectItem>
            <SelectItem value="12">12pt - Extra Large</SelectItem>
            <SelectItem value="14">14pt - Huge</SelectItem>
            <SelectItem value="16">16pt - Massive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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