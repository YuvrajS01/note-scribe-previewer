import { ContentBlock, ContentBlockComponent } from './ContentBlock';

interface LivePreviewProps {
  blocks: ContentBlock[];
  fontSize: number;
  lineGap: number;
  paragraphGap: number;
  leftColumnGap: number;
  rightColumnGap: number;
}

export const LivePreview = ({ blocks, fontSize, lineGap, paragraphGap, leftColumnGap, rightColumnGap }: LivePreviewProps) => {
  // Split blocks into two columns
  const leftBlocks = blocks.filter((_, i) => i % 2 === 0);
  const rightBlocks = blocks.filter((_, i) => i % 2 === 1);

  return (
    <div className="app-panel p-6 live-preview-root">
      <h3 className="text-lg font-semibold text-foreground mb-4">Live Preview</h3>
      <div className="w-full max-w-4xl mx-auto">
        <div className="a4-paper w-full">
          <div className="notes-container grid grid-cols-2 gap-x-4">
            <div className="flex flex-col" style={{ rowGap: `${leftColumnGap}px` }}>
              {leftBlocks.length === 0 ? (
                <div className="text-muted-foreground text-center py-8 col-span-2">
                  <p className="text-sm">Your formatted document will appear here</p>
                  <p className="text-xs mt-2">Add content blocks to see the live preview</p>
                </div>
              ) : (
                leftBlocks.map((block) => (
                  <ContentBlockComponent key={block.id} block={block} fontSize={fontSize} />
                ))
              )}
            </div>
            <div className="flex flex-col" style={{ rowGap: `${rightColumnGap}px` }}>
              {rightBlocks.map((block) => (
                <ContentBlockComponent key={block.id} block={block} fontSize={fontSize} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};