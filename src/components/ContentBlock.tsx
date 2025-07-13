export interface ContentBlock {
  id: string;
  topic: string;
  notes: string;
  createdAt: Date;
}

export interface ContentBlockProps {
  block: ContentBlock;
}

export const ContentBlockComponent = ({ block }: ContentBlockProps) => {
  return (
    <div className="content-block">
      <h3>{block.topic}</h3>
      <p>{block.notes}</p>
    </div>
  );
};