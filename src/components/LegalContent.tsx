import React from 'react';

interface Props {
  content: string;
}

export function LegalContent({ content }: Props) {
  // Split content into paragraphs and process formatting
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph, index) => {
        const trimmed = paragraph.trim();

        // Check if it's a list
        if (trimmed.startsWith('- ') || /^\d+\./.test(trimmed)) {
          const items = trimmed.split('\n').filter(line => line.trim());
          const isBulletList = items[0]?.startsWith('- ') ?? false;

          return (
            <ul key={index} className={`space-y-3 ${isBulletList ? 'list-none' : 'list-decimal'} ml-0`}>
              {items.map((item, i) => {
                const cleanItem = item.replace(/^-\s*/, '').replace(/^\d+\.\s*/, '');
                return (
                  <li key={i} className="flex items-start gap-3">
                    {isBulletList && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />}
                    <span className="text-foreground leading-relaxed">{renderFormattedText(cleanItem)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Check if it's a heading (starts with **)
        if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
          const headingText = trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '');
          return (
            <h3 key={index} className="text-lg font-bold text-foreground mt-6 mb-3">
              {headingText}
            </h3>
          );
        }

        // Regular paragraph
        return (
          <p key={index} className="text-foreground leading-relaxed">
            {renderFormattedText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Helper function to render bold text and other formatting
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.replace(/^\*\*/, '').replace(/\*\*$/, '');
      return (
        <strong key={index} className="font-semibold text-foreground">
          {boldText}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
