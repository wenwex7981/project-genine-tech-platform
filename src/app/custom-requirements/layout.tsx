import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Project Requirements | GraduateNex',
  description: 'Submit your custom project requirements for personalized academic and engineering project solutions at GraduateNex.',
  alternates: {
    canonical: 'https://www.graduatenex.online/custom-requirements',
  },
  openGraph: {
    title: 'Custom Project Requirements | GraduateNex',
    description: 'Submit your custom project requirements for personalized academic and engineering project solutions at GraduateNex.',
    url: 'https://www.graduatenex.online/custom-requirements',
    siteName: 'GraduateNex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Project Requirements | GraduateNex',
    description: 'Submit your custom project requirements for personalized academic and engineering project solutions at GraduateNex.',
  }
};

export default function CustomRequirementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
