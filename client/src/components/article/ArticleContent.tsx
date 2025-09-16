import React from 'react';
import DOMPurify from 'dompurify';

interface ArticleContentProps {
  content: string;
}

const ArticleContent = ({ content }: ArticleContentProps) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className="prose prose-lg prose-invert max-w-none">
      <div 
        className="article-content text-white/90 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        style={{
          fontSize: '1.125rem',
          lineHeight: '1.8',
        }}
      />
      
      <style>{`
        .article-content h1,
        .article-content h2,
        .article-content h3,
        .article-content h4,
        .article-content h5,
        .article-content h6 {
          color: white;
          font-family: 'IM Fell DW Pica', serif;
          font-weight: bold;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        
        .article-content h2 {
          font-size: 2rem;
          border-bottom: 2px solid var(--flame-red);
          padding-bottom: 0.5rem;
        }
        
        .article-content h3 {
          font-size: 1.5rem;
          color: var(--flame-red);
        }
        
        .article-content p {
          margin-bottom: 1.5rem;
        }
        
        .article-content a {
          color: var(--flame-red);
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        
        .article-content a:hover {
          color: var(--spice-orange);
        }
        
        .article-content ul,
        .article-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .article-content li {
          margin-bottom: 0.5rem;
        }
        
        .article-content blockquote {
          border-left: 4px solid var(--flame-red);
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: var(--spice-orange);
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0 8px 8px 0;
          padding: 1.5rem;
        }
        
        .article-content img {
          border-radius: 12px;
          margin: 2rem 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .article-content code {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'Monaco', 'Consolas', monospace;
        }
        
        .article-content pre {
          background: rgba(0, 0, 0, 0.5);
          padding: 1.5rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default ArticleContent;