import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'blog';
  twitterImage?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  twitterImage,
  keywords,
  author,
  publishedTime,
  modifiedTime,
  section,
  tags,
  noindex = false,
  nofollow = false,
}) => {
  const baseUrl = 'https://cyprus-pet-hub.vercel.app';
  const defaultTitle = 'Cyprus Pet Hub - Pet Community Forum & Blog';
  const defaultDescription = 'Join Cyprus\'s leading pet community forum. Share experiences, get expert advice, and discover pet care resources.';
  const defaultImage = `${baseUrl}/og-image.jpg`;
  
  const fullTitle = title ? `${title} | Cyprus Pet Hub` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : undefined;
  const fullOgImage = ogImage ? `${baseUrl}${ogImage}` : defaultImage;
  const fullTwitterImage = twitterImage ? `${baseUrl}${twitterImage}` : fullOgImage;
  
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow'
  ].join(', ');

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* Open Graph meta tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="Cyprus Pet Hub" />
      <meta property="og:locale" content="en_US" />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      
      {/* Article specific Open Graph tags */}
      {ogType === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags && tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cypruspethub" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={fullTwitterImage} />
    </Helmet>
  );
};

export default SEO;
