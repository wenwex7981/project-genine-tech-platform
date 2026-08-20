import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | GraduateNex',
  description: 'Learn about the refund and cancellation policy for projects, services, and digital products at GraduateNex.',
  alternates: {
    canonical: 'https://www.graduatenex.online/refunds',
  },
  openGraph: {
    title: 'Refund & Cancellation Policy | GraduateNex',
    description: 'Learn about the refund and cancellation policy for projects, services, and digital products at GraduateNex.',
    url: 'https://www.graduatenex.online/refunds',
    siteName: 'GraduateNex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Refund & Cancellation Policy | GraduateNex',
    description: 'Learn about the refund and cancellation policy for projects, services, and digital products at GraduateNex.',
  }
};

export default function RefundsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
