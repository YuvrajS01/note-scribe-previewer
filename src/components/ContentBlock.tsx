export interface ContentBlock {
  id: string;
  topic: string;
  notes: string;
  images?: string[]; // Base64 encoded images
  createdAt: Date;
}

export interface ContentBlockProps {
  block: ContentBlock;
  fontSize: number;
  paragraphGap?: number;
}

export const ContentBlockComponent = ({ block, fontSize }: ContentBlockProps) => {
  return (
    <div className="content-block">
      <h3 style={{ fontSize: `${fontSize + 2}pt` }}>{block.topic}</h3>
      <div>
        {block.notes.split('\n').map((paragraph, index, arr) => (
          <p key={index} style={{ fontSize: `${fontSize}pt`, marginBottom: index !== arr.length - 1 ? `4px` : 0, marginTop: 0 }}>{paragraph}</p>
        ))}
        {block.images && block.images.length > 0 && (
          <div className="block-images mt-2">
            {block.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Note image ${index + 1}`}
                className="max-w-full h-auto mb-2 rounded border"
                style={{ maxHeight: '100px' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};