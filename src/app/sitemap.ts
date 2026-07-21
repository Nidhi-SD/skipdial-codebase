import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.skipdial.ai';

  const routes = [
    '',
    '/inbound-calling',
    '/outbound-calling',
    '/how-it-works',
    '/industries',
    '/industries/home-services',
    '/industries/real-estate-property-management',
    '/industries/professional-offices',
    '/integrations',
    '/request-a-free-demo',
    '/blog',
    '/privacy-policy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
