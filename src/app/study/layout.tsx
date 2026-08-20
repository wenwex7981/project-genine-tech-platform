import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Hub | Interview Prep & Career Guidance | GraduateNex',
  description: 'Access top-tier interview preparation and career guidance for Indian students at GraduateNex Study Hub.',
  alternates: {
    canonical: 'https://www.graduatenex.online/study',
  },
  openGraph: {
    title: 'Study Hub | Interview Prep & Career Guidance | GraduateNex',
    description: 'Access top-tier interview preparation and career guidance for Indian students at GraduateNex Study Hub.',
    url: 'https://www.graduatenex.online/study',
    siteName: 'GraduateNex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Hub | Interview Prep & Career Guidance | GraduateNex',
    description: 'Access top-tier interview preparation and career guidance for Indian students at GraduateNex Study Hub.',
  }
};

export default function StudyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
