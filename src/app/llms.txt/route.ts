import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# GraduateNex

> India's #1 Academic & Career Success Platform for Engineering Students

GraduateNex provides production-ready final year projects with source code, zero-plagiarism research papers, AI-powered document generation, ATS resume building tools, and hackathon discovery for Indian engineering students and freshers.

## Services

- Final Year Projects: Production-ready source code for BTech/MTech projects across ML, AI, Web Development, IoT, Blockchain, Cloud Computing
- Documentation: IEEE-format research papers, project reports, abstracts, PPTs with zero plagiarism
- Resume Hub: Free ATS resume checker, JD-matching analyzer, AI resume builder, premium resume templates
- Study Hub: AI-powered interview preparation guides, career guidance roadmaps with visual timelines
- Hackathon Directory: Discover and participate in college & company hackathons across India
- AI Tools: AI abstract generator, AI humanizer, AI blog generator

## Key URLs

- Homepage: https://www.graduatenex.online
- Projects: https://www.graduatenex.online/projects
- Resume Hub: https://www.graduatenex.online/resume
- Study Hub: https://www.graduatenex.online/study
- Hackathons: https://www.graduatenex.online/hackathons
- Blog: https://www.graduatenex.online/blog
- Services: https://www.graduatenex.online/services
- Pricing: https://www.graduatenex.online/pricing
- AI Tools: https://www.graduatenex.online/ai-services
- Contact: https://www.graduatenex.online/contact

## Target Audience

Indian engineering students (BTech, MTech, BCA, MCA) from universities including JNTUH, JNTUK, Anna University, VTU, Mumbai University, SPPU, Osmania University, SRM, VIT, IIT, NIT, IIIT, BITS Pilani, and 100+ more.

## Contact

- Email: projectgenie16@gmail.com
- Website: https://www.graduatenex.online
- Location: India
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
