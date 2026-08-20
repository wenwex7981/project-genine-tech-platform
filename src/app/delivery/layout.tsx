import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delivery Policy | Digital Product Delivery | GraduateNex',
  description: 'Details regarding the delivery policy and timelines for digital products and projects purchased on GraduateNex.',
  alternates: {
    canonical: 'https://www.graduatenex.online/delivery',
  },
  openGraph: {
    title: 'Delivery Policy | Digital Product Delivery | GraduateNex',
    description: 'Details regarding the delivery policy and timelines for digital products and projects purchased on GraduateNex.',
    url: 'https://www.graduatenex.online/delivery',
    siteName: 'GraduateNex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delivery Policy | Digital Product Delivery | GraduateNex',
    description: 'Details regarding the delivery policy and timelines for digital products and projects purchased on GraduateNex.',
  }
};

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
