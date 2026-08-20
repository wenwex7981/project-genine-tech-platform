import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | GraduateNex',
  description: 'Review the terms and conditions for using GraduateNex platform, services, and digital products.',
  alternates: {
    canonical: 'https://www.graduatenex.online/terms',
  },
  openGraph: {
    title: 'Terms & Conditions | GraduateNex',
    description: 'Review the terms and conditions for using GraduateNex platform, services, and digital products.',
    url: 'https://www.graduatenex.online/terms',
    siteName: 'GraduateNex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions | GraduateNex',
    description: 'Review the terms and conditions for using GraduateNex platform, services, and digital products.',
  }
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
