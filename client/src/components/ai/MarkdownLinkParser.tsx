import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface MarkdownLinkParserProps {
  content: string;
  onProductClick?: (productId: string) => void;
}

export const MarkdownLinkParser: React.FC<MarkdownLinkParserProps> = ({ content, onProductClick }) => {
  const navigate = useNavigate();

  const parseMarkdownLinks = (text: string) => {
    // Regex to match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      const linkText = match[1];
      const url = match[2];

      // Check if it's a product link
      const productMatch = url.match(/\/products\/([^/?]+)/);
      if (productMatch) {
        const productSlug = productMatch[1];
        
        parts.push(
          <Button
            key={`link-${match.index}`}
            variant="link"
            className="h-auto p-0 text-flame-red hover:text-flame-red/80 underline text-sm inline-flex items-center gap-1"
            onClick={() => {
              if (onProductClick) {
                // Try to extract product ID if available, otherwise use slug
                onProductClick(productSlug);
              }
              navigate(`/products/${productSlug}`);
            }}
          >
            <ShoppingCart className="h-3 w-3" />
            {linkText}
          </Button>
        );
      } else {
        // Regular external link
        parts.push(
          <a
            key={`link-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-flame-red hover:text-flame-red/80 underline"
          >
            {linkText}
          </a>
        );
      }

      lastIndex = linkRegex.lastIndex;
    }

    // Add remaining text after the last link
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  const parsedContent = parseMarkdownLinks(content);

  return (
    <span className="text-sm whitespace-pre-wrap">
      {parsedContent.map((part, index) => 
        typeof part === 'string' ? (
          <span key={index}>{part}</span>
        ) : (
          React.cloneElement(part, { key: part.key || index })
        )
      )}
    </span>
  );
};