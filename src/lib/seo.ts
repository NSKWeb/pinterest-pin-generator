export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

export function generateMetadata(
  seo: SEOMetadata,
  baseUrl: string = "https://multitool.example.com"
) {
  const fullUrl = seo.canonical ? `${baseUrl}${seo.canonical}` : baseUrl;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.join(", "),
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: fullUrl,
      siteName: "MultiTool",
      images: seo.ogImage ? [{ url: seo.ogImage }] : [],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
    canonical: fullUrl,
  };
}
