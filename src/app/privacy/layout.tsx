import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | GraduateNex',
  description: 'Read the privacy policy of GraduateNex to understand how we protect your personal information and data.',
  alternates: {
    canonical: 'https://www.graduatenex.online/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | GraduateNex',
    description: 'Read the privacy policy of GraduateNex to understand how we protect your personal information and data.',
    url: 'https://www.graduatenex.online/privacy',
    siteName: 'GraduateNex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | GraduateNex',
    description: 'Read the privacy policy of GraduateNex to understand how we protect your personal information and data.',
  }
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
