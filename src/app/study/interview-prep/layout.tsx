import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interview Preparation Guide for Freshers | GraduateNex',
  description: 'Comprehensive interview preparation guide and resources tailored for engineering freshers in India.',
  alternates: {
    canonical: 'https://www.graduatenex.online/study/interview-prep',
  },
  openGraph: {
    title: 'Interview Preparation Guide for Freshers | GraduateNex',
    description: 'Comprehensive interview preparation guide and resources tailored for engineering freshers in India.',
    url: 'https://www.graduatenex.online/study/interview-prep',
    siteName: 'GraduateNex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interview Preparation Guide for Freshers | GraduateNex',
    description: 'Comprehensive interview preparation guide and resources tailored for engineering freshers in India.',
  }
};

export default function InterviewPrepLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
