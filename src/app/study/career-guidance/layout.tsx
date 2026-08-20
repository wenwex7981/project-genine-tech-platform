import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Guidance for Engineering Students | GraduateNex',
  description: 'Expert career guidance and roadmap planning for engineering students to secure top tech jobs.',
  alternates: {
    canonical: 'https://www.graduatenex.online/study/career-guidance',
  },
  openGraph: {
    title: 'Career Guidance for Engineering Students | GraduateNex',
    description: 'Expert career guidance and roadmap planning for engineering students to secure top tech jobs.',
    url: 'https://www.graduatenex.online/study/career-guidance',
    siteName: 'GraduateNex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Guidance for Engineering Students | GraduateNex',
    description: 'Expert career guidance and roadmap planning for engineering students to secure top tech jobs.',
  }
};

export default function CareerGuidanceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
