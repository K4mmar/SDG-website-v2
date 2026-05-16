import React from 'react';
import DOMPurify from 'dompurify';

interface WpContentProps {
  html: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const WpContent: React.FC<WpContentProps> = ({ html, className = '', as: Component = 'div' }) => {
  // Sanitize the HTML string to prevent XSS attacks
  const cleanHtml = DOMPurify.sanitize(html);

  // We use standard HTML5 tags and a 'wp-content' class.
  // In Tailwind you could install `@tailwindcss/typography` and add the `prose` class here,
  // or define `.wp-content h2`, `.wp-content p` etc., in index.css.
  return (
    <Component 
      className={`wp-content ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};

export default WpContent;
