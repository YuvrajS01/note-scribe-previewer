import { ContentBlock, ContentBlockComponent } from './ContentBlock';

interface LivePreviewProps {
  blocks: ContentBlock[];
  fontSize: number;
}

export const LivePreview = ({ blocks, fontSize }: LivePreviewProps) => {
  return (
    <div className="app-panel p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Live Preview</h3>
      
      <div className="w-full max-w-[600px] mx-auto">
        <div className="a4-paper">
          <div 
            className="notes-container" 
            style={{ fontSize: `${fontSize}pt` }}
          >
            {blocks.length === 0 ? (
              <div className="text-muted-foreground text-center py-8">
                <p className="text-sm">Your formatted document will appear here</p>
                <p className="text-xs mt-2">Add content blocks to see the live preview</p>
              </div>
            ) : (
              blocks.map((block) => (
                <ContentBlockComponent key={block.id} block={block} fontSize={fontSize} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};