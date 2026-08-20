import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Abstract Generator for Research Papers | GraduateNex',
  description: 'Generate high-quality AI abstracts for your research papers and academic projects instantly with GraduateNex.',
  alternates: {
    canonical: 'https://www.graduatenex.online/ai-abstracts',
  },
  openGraph: {
    title: 'AI Abstract Generator for Research Papers | GraduateNex',
    description: 'Generate high-quality AI abstracts for your research papers and academic projects instantly with GraduateNex.',
    url: 'https://www.graduatenex.online/ai-abstracts',
    siteName: 'GraduateNex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Abstract Generator for Research Papers | GraduateNex',
    description: 'Generate high-quality AI abstracts for your research papers and academic projects instantly with GraduateNex.',
  }
};

export default function AiAbstractsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
