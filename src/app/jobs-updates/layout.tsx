import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jobs, Internships & AI Updates | GraduateNex',
  description: 'Fresh software jobs, internships & AI news updated every hour. Curated from 10+ sources — only last 48 hours. No old listings ever.',
  keywords: ['software jobs','internships 2024','ai updates','fresher jobs','remote jobs india','tech jobs freshers','campus placements'],
  openGraph: {
    title: 'Fresh Jobs & AI Updates | GraduateNex',
    description: 'Live software jobs, internships & AI news for engineering students. Updated every hour.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
