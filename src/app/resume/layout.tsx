import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker & JD Matcher | GraduateNex",
  description: "Check your resume ATS score for free, use our Job Description (JD) matcher, and access community resume templates tailored for Indian tech students.",
  keywords: ["ATS resume checker free", "JD matcher", "resume templates", "BTech resume", "data science resume", "software engineer resume india"],
  alternates: {
    canonical: "https://graduatenex.online/resume",
  }
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'GraduateNex ATS Resume Checker',
    operatingSystem: 'Any',
    applicationCategory: 'BusinessApplication',
    description: 'Free AI-powered ATS resume score checker and Job Description matching tool for engineering students and professionals.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    url: 'https://graduatenex.online/resume'
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
