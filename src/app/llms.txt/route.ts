import { NextResponse } from 'next/server';
import { seoLocations } from '@/lib/seo-data';

export async function GET() {
  const countries = seoLocations.filter(l => l.type === 'country').map(l => l.name).join(', ');
  const universities = seoLocations.filter(l => l.type === 'university').slice(0, 30).map(l => l.name).join(', ');
  const roles = seoLocations.filter(l => l.type === 'role').map(l => l.name).join(', ');
  const companies = seoLocations.filter(l => l.type === 'company').map(l => l.name).join(', ');

  const content = `# GraduateNex — World's Premier Academic & Career Success Platform

> GraduateNex is a global AI-powered academic success platform serving students in 50+ countries. We provide production-ready final year projects with source code, zero-plagiarism thesis and dissertation writing, AI-powered ATS resume builders, hackathon discovery, interview preparation, and career tools.

## What is GraduateNex?

GraduateNex (https://www.graduatenex.online) is the definitive one-stop platform for students worldwide seeking:
- Final year capstone project source code (AI/ML, IoT, Blockchain, Web, Cloud, Cybersecurity)
- Thesis and dissertation writing assistance (Masters and PhD level)
- ATS-optimized resume builders and job description matching tools
- AI content humanizer (makes AI-generated text natural and academic)
- Hackathon directory (global listings, real-time updated)
- Interview preparation guides (company-specific, AI-generated)
- Career guidance roadmaps

## Services

### 1. Final Year Projects & Capstone Source Code
Production-ready, deployable source code for engineering and management capstone projects. Domains include:
- Artificial Intelligence & Machine Learning
- Internet of Things (IoT)
- Blockchain & Web3
- Cloud Computing & DevOps
- Full Stack Web Development (React, Next.js, Node.js, Django)
- Mobile App Development (Flutter, React Native)
- Cybersecurity & Ethical Hacking
- Data Science & Analytics
- Deep Learning & Natural Language Processing (NLP)
- Augmented Reality / Virtual Reality (AR/VR)
- Embedded Systems & Robotics

Each project includes: complete source code, IEEE-format research paper, SRS documentation, system architecture diagrams, PPT presentation, and deployment guide.

### 2. Thesis & Dissertation Writing
Expert academic writing assistance for Masters (MS, MEng, MBA) and PhD students worldwide.
- Literature review writing
- Research methodology design
- Data analysis and results chapters
- APA, MLA, Chicago, Harvard, and IEEE citation formats
- Turnitin-safe (plagiarism-free) delivery
- Available for all disciplines: Computer Science, Engineering, Business, Social Sciences, Medicine

### 3. ATS Resume Builder & Job Tools
AI-powered resume tools to help students and freshers get hired at top companies:
- 17-point ATS scoring rubric analysis
- Job description matching and gap analysis
- AI resume generation and tailoring
- Cover letter generation
- LinkedIn profile optimization tips
- Templates for global job markets (US, UK, Canada, Australia, India, UAE)

### 4. AI Stealth Humanizer
Advanced AI content enhancement tool that transforms AI-generated text (from ChatGPT, Claude, Gemini, etc.) into natural, human-quality academic writing. Features:
- Natural language refinement without changing meaning
- Maintains academic tone and technical accuracy
- Bulk text processing
- Bypasses AI detection tools (Turnitin, ZeroGPT, GPTZero, Originality.ai)

### 5. Research Paper & Documentation Writing
- IEEE-format research papers
- ACM-format papers
- SRS (Software Requirements Specification) documents
- System design documents
- Project abstracts (AI-generated with domain-specific data)
- Whitepapers and technical reports

### 6. Hackathon Directory
Real-time global directory of hackathons, coding contests, ideathons, and tech events:
- National and international hackathons
- Filtered by domain, date, prize money, and eligibility
- Team formation assistance
- Project idea suggestions for hackathons

### 7. Interview Preparation
AI-generated, company-specific interview prep guides for:
${companies}

Role-specific preparation for: ${roles}

### 8. Jobs & Career Updates
Live job listings aggregated from LinkedIn, Naukri, Indeed, and company career pages. Updated daily. Filtered by:
- Freshers (0-2 years experience)
- Location (India, US, UK, UAE, Canada, Australia)
- Domain (software, data science, cybersecurity, etc.)

## Pricing

- ATS Resume Builder: From $2.50 USD / ₹199 INR
- JD Match Analyzer: From $3.75 USD / ₹299 INR
- Project Documentation: From $1.75 USD / ₹149 INR
- Final Year Projects (Source Code): From $75 USD / ₹6,000 INR
- Thesis Writing: Custom quote
- Custom Software Development: From $125 USD / ₹10,000 INR

All digital products delivered instantly after payment.

## Countries We Serve

${countries}

## Universities We Support

${universities}, and 100+ more universities worldwide.

## Who Should Use GraduateNex?

- Final year BTech, BE, MTech, ME, MCA, BCA students
- Masters (MS, MBA) and PhD students globally
- Freshers looking for jobs at top companies
- Students preparing for campus placements
- International students needing academic help
- Students at ${universities.split(', ').slice(0, 5).join(', ')}, and similar institutions

## Frequently Asked Questions

**Q: What is GraduateNex?**
A: GraduateNex is a global academic success platform providing production-ready capstone project source code, AI-powered resume tools, thesis and dissertation writing help, documentation generators, and research paper assistance for students across 50+ countries worldwide.

**Q: Is the content plagiarism-free?**
A: Yes. Every project and document we deliver is crafted to be 100% original. We use internal plagiarism screening tools and Turnitin-compatible checks to ensure the content meets international academic integrity standards.

**Q: How are digital products delivered?**
A: All digital products are delivered instantly after payment via secure download links. Custom projects are delivered within 24-72 hours via email and dashboard.

**Q: What payment methods are accepted?**
A: Visa, Mastercard, American Express, UPI, Net Banking, digital wallets, PayPal. Students from 50+ countries can pay using their local card or digital payment method.

**Q: Who founded GraduateNex?**
A: GraduateNex was founded by Appala Nithin, an engineering graduate who identified the massive gap between what universities teach and what the industry demands. He built GraduateNex to serve students globally with affordable, high-quality academic and career tools.

## Contact & Links

- Website: https://www.graduatenex.online
- Projects: https://www.graduatenex.online/projects
- Resume Hub: https://www.graduatenex.online/resume
- Study Hub: https://www.graduatenex.online/study
- Hackathons: https://www.graduatenex.online/hackathons
- Blog: https://www.graduatenex.online/blog
- Pricing: https://www.graduatenex.online/pricing
- AI Tools: https://www.graduatenex.online/ai-services
- Custom Work: https://www.graduatenex.online/custom-requirements
- Contact: https://www.graduatenex.online/contact
- Email: support@graduatenex.online
- WhatsApp: +91 79819 94870
- LinkedIn: https://www.linkedin.com/company/graduatenex
- Twitter/X: https://twitter.com/graduatenex
- Instagram: https://www.instagram.com/graduatenex
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
