const fs = require('fs');
const path = require('path');

const layouts = [
  {
    path: 'src/app/contact/layout.tsx',
    title: 'Contact GraduateNex | Get Support for Academic Projects',
    description: 'Contact GraduateNex for support with academic projects, technical guidance, and queries.',
    canonical: '/contact',
    name: 'ContactLayout'
  },
  {
    path: 'src/app/custom-requirements/layout.tsx',
    title: 'Custom Project Requirements | GraduateNex',
    description: 'Submit your custom project requirements for personalized academic and engineering project solutions at GraduateNex.',
    canonical: '/custom-requirements',
    name: 'CustomRequirementsLayout'
  },
  {
    path: 'src/app/study/layout.tsx',
    title: 'Study Hub | Interview Prep & Career Guidance | GraduateNex',
    description: 'Access top-tier interview preparation and career guidance for Indian students at GraduateNex Study Hub.',
    canonical: '/study',
    name: 'StudyLayout'
  },
  {
    path: 'src/app/study/interview-prep/layout.tsx',
    title: 'Interview Preparation Guide for Freshers | GraduateNex',
    description: 'Comprehensive interview preparation guide and resources tailored for engineering freshers in India.',
    canonical: '/study/interview-prep',
    name: 'InterviewPrepLayout'
  },
  {
    path: 'src/app/study/career-guidance/layout.tsx',
    title: 'Career Guidance for Engineering Students | GraduateNex',
    description: 'Expert career guidance and roadmap planning for engineering students to secure top tech jobs.',
    canonical: '/study/career-guidance',
    name: 'CareerGuidanceLayout'
  },
  {
    path: 'src/app/ai-abstracts/layout.tsx',
    title: 'AI Abstract Generator for Research Papers | GraduateNex',
    description: 'Generate high-quality AI abstracts for your research papers and academic projects instantly with GraduateNex.',
    canonical: '/ai-abstracts',
    name: 'AiAbstractsLayout'
  },
  {
    path: 'src/app/privacy/layout.tsx',
    title: 'Privacy Policy | GraduateNex',
    description: 'Read the privacy policy of GraduateNex to understand how we protect your personal information and data.',
    canonical: '/privacy',
    name: 'PrivacyLayout'
  },
  {
    path: 'src/app/terms/layout.tsx',
    title: 'Terms & Conditions | GraduateNex',
    description: 'Review the terms and conditions for using GraduateNex platform, services, and digital products.',
    canonical: '/terms',
    name: 'TermsLayout'
  },
  {
    path: 'src/app/refunds/layout.tsx',
    title: 'Refund & Cancellation Policy | GraduateNex',
    description: 'Learn about the refund and cancellation policy for projects, services, and digital products at GraduateNex.',
    canonical: '/refunds',
    name: 'RefundsLayout'
  },
  {
    path: 'src/app/delivery/layout.tsx',
    title: 'Delivery Policy | Digital Product Delivery | GraduateNex',
    description: 'Details regarding the delivery policy and timelines for digital products and projects purchased on GraduateNex.',
    canonical: '/delivery',
    name: 'DeliveryLayout'
  }
];

const generateLayout = (meta) => {
  return `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${meta.title}',
  description: '${meta.description}',
  alternates: {
    canonical: 'https://www.graduatenex.online${meta.canonical}',
  },
  openGraph: {
    title: '${meta.title}',
    description: '${meta.description}',
    url: 'https://www.graduatenex.online${meta.canonical}',
    siteName: 'GraduateNex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${meta.title}',
    description: '${meta.description}',
  }
};

export default function ${meta.name}({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;
};

layouts.forEach(meta => {
  const fullPath = path.join(__dirname, meta.path);
  fs.writeFileSync(fullPath, generateLayout(meta));
  console.log('Created layout:', fullPath);
});

// Update about page
const aboutPagePath = path.join(__dirname, 'src/app/about/page.tsx');
let aboutContent = fs.readFileSync(aboutPagePath, 'utf8');

const metadataExport = `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About GraduateNex | India's #1 Academic Project Platform",
  description: "Learn about GraduateNex, India's leading platform for academic projects, research assistance, and career guidance for engineering students.",
  alternates: {
    canonical: 'https://www.graduatenex.online/about',
  },
  openGraph: {
    title: "About GraduateNex | India's #1 Academic Project Platform",
    description: "Learn about GraduateNex, India's leading platform for academic projects, research assistance, and career guidance for engineering students.",
    url: 'https://www.graduatenex.online/about',
    siteName: 'GraduateNex',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "About GraduateNex | India's #1 Academic Project Platform",
    description: "Learn about GraduateNex, India's leading platform for academic projects, research assistance, and career guidance for engineering students.",
  }
};

`;

if (!aboutContent.includes('export const metadata')) {
  // If the file has a "use client" we'd skip, but we checked it's a server component.
  // We can just add it after imports or at top.
  const importMatch = aboutContent.match(/^import .*?;?$/gm);
  if (importMatch && importMatch.length > 0) {
    const lastImport = importMatch[importMatch.length - 1];
    aboutContent = aboutContent.replace(lastImport, lastImport + '\\n\\n' + metadataExport);
  } else {
    aboutContent = metadataExport + aboutContent;
  }
  fs.writeFileSync(aboutPagePath, aboutContent);
  console.log('Updated about page:', aboutPagePath);
}
