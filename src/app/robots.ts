import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/cart/', '/api/'],
    },
    sitemap: 'https://graduatenex.online/sitemap.xml',
  };
}
