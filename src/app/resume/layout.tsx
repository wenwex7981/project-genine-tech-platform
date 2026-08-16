import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free ATS Resume Builder & FANG Template Maker | GraduateNex",
  description: "Create a 1-page, ATS-friendly resume tailored to any Job Description. Our free AI resume builder for Indian freshers generates FANG-standard resumes that bypass ATS bots.",
  keywords: ["Free ATS Resume Checker India", "JD matcher", "FANG resume templates", "BTech resume", "data science resume", "software engineer resume india"],
  alternates: {
    canonical: "https://www.graduatenex.online/resume",
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
