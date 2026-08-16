import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Hackathons in India 2026 | Tech Events for Students",
  description: "Find the best upcoming offline and online hackathons in India. Join coding competitions, win cash prizes, and network with tech companies. Exclusive hackathon pass available.",
  keywords: ["upcoming hackathons in india 2026", "coding competitions for students", "hackathons for beginners", "tech events hyderabad", "smart india hackathon alternatives", "offline hackathons bangalore"],
  alternates: {
    canonical: "https://www.graduatenex.online/hackathons",
  }
};

export default function HackathonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    name: 'GraduateNex Hackathon Circuit',
    description: 'A directory of premium hackathons and coding competitions for engineering students across India.',
    url: 'https://www.graduatenex.online/hackathons',
    organizer: {
      '@type': 'Organization',
      name: 'GraduateNex',
      url: 'https://www.graduatenex.online'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
