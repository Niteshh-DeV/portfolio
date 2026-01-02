import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({ 
  title = 'Computer Engineering Student & Developer',
  description = 'Computer Engineering student from Nepal passionate about AI/ML, open source, and building meaningful digital experiences.',
  image = 'https://niteshjoshi.me/og-image.png',
  url = 'https://niteshjoshi.me',
  type = 'website'
}: SEOProps) {
  const fullTitle = title.includes('Nitesh Joshi') 
    ? title 
    : `${title} | Nitesh Joshi`;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph (LinkedIn, Facebook) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
