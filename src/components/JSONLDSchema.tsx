import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface BlogPostSchemaProps {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  imageUrl?: string;
  tags?: string[];
  readTime?: string;
}

export interface QAPageSchemaProps {
  question: string;
  questionAuthor: string;
  dateCreated: string;
  answers?: Array<{
    text: string;
    author: string;
    dateCreated: string;
    upvotes?: number;
    isAccepted?: boolean;
  }>;
  url: string;
  category?: string;
}

export interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    country: string;
    region: string;
  };
  socialLinks?: string[];
}

// Blog Post Schema Component
export const BlogPostSchema: React.FC<BlogPostSchemaProps> = ({
  title,
  description,
  author,
  datePublished,
  dateModified,
  url,
  imageUrl,
  tags,
  readTime,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': title,
    'description': description,
    'author': {
      '@type': 'Person',
      'name': author,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Cyprus Pet Hub',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://cyprus-pet-hub.vercel.app/logo.png',
      },
    },
    'datePublished': datePublished,
    'dateModified': dateModified || datePublished,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': url,
    },
    'url': url,
    ...(imageUrl && {
      'image': {
        '@type': 'ImageObject',
        'url': imageUrl,
        'width': 1200,
        'height': 630,
      },
    }),
    ...(tags && {
      'keywords': tags.join(', '),
    }),
    ...(readTime && {
      'timeRequired': readTime,
    }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Q&A Page Schema Component
export const QAPageSchema: React.FC<QAPageSchemaProps> = ({
  question,
  questionAuthor,
  dateCreated,
  answers = [],
  url,
  category,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    'mainEntity': {
      '@type': 'Question',
      'name': question,
      'text': question,
      'author': {
        '@type': 'Person',
        'name': questionAuthor,
      },
      'dateCreated': dateCreated,
      'url': url,
      ...(category && { 'category': category }),
      ...(answers.length > 0 && {
        'acceptedAnswer': answers.find(a => a.isAccepted) ? {
          '@type': 'Answer',
          'text': answers.find(a => a.isAccepted)?.text,
          'author': {
            '@type': 'Person',
            'name': answers.find(a => a.isAccepted)?.author,
          },
          'dateCreated': answers.find(a => a.isAccepted)?.dateCreated,
          'upvoteCount': answers.find(a => a.isAccepted)?.upvotes || 0,
        } : undefined,
        'suggestedAnswer': answers.filter(a => !a.isAccepted).map(answer => ({
          '@type': 'Answer',
          'text': answer.text,
          'author': {
            '@type': 'Person',
            'name': answer.author,
          },
          'dateCreated': answer.dateCreated,
          'upvoteCount': answer.upvotes || 0,
        })),
      }),
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Breadcrumb Schema Component
export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Organization Schema Component
export const OrganizationSchema: React.FC<OrganizationSchemaProps> = ({
  name,
  url,
  logo,
  description,
  address,
  socialLinks = [],
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': name,
    'url': url,
    'logo': logo,
    'description': description,
    ...(address && {
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': address.country,
        'addressRegion': address.region,
      },
    }),
    ...(socialLinks.length > 0 && {
      'sameAs': socialLinks,
    }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Combined JSON-LD Schema Component
interface JSONLDSchemaProps {
  blogPost?: BlogPostSchemaProps;
  qaPage?: QAPageSchemaProps;
  breadcrumb?: BreadcrumbSchemaProps;
  organization?: OrganizationSchemaProps;
}

const JSONLDSchema: React.FC<JSONLDSchemaProps> = ({
  blogPost,
  qaPage,
  breadcrumb,
  organization,
}) => {
  return (
    <>
      {blogPost && <BlogPostSchema {...blogPost} />}
      {qaPage && <QAPageSchema {...qaPage} />}
      {breadcrumb && <BreadcrumbSchema {...breadcrumb} />}
      {organization && <OrganizationSchema {...organization} />}
    </>
  );
};

export default JSONLDSchema;
