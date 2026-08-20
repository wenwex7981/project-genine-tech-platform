import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact GraduateNex | Get Support for Academic Projects',
  description: 'Contact GraduateNex for support with academic projects, technical guidance, and queries.',
  alternates: {
    canonical: 'https://www.graduatenex.online/contact',
  },
  openGraph: {
    title: 'Contact GraduateNex | Get Support for Academic Projects',
    description: 'Contact GraduateNex for support with academic projects, technical guidance, and queries.',
    url: 'https://www.graduatenex.online/contact',
    siteName: 'GraduateNex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact GraduateNex | Get Support for Academic Projects',
    description: 'Contact GraduateNex for support with academic projects, technical guidance, and queries.',
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
