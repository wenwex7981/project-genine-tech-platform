import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import mammoth from 'mammoth';
import PDFParser from 'pdf2json';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key_for_build',
});

const RESUME_PROMPT = `You are an elite AI Resume Writer and Career Coach. 
Your task is to generate a highly professional, ATS-optimized 1-page resume based on the user's prompt, personal details, and an optional sample template.

CRITICAL BEHAVIORS:
1. NO EXPERIENCE: If the user explicitly states they have no experience (or internship), DO NOT generate the experience section. Leave it out or empty.
2. NO PROJECTS: If the user doesn't mention specific projects, generate 2-3 HIGHLY RELEVANT, professional dummy projects that fit their desired role (to help them land an interview).
3. 1-PAGE RULE: Keep the output concise to fit on a standard 1-page resume unless the user explicitly requests a 2-page resume.
4. ATS FRIENDLY: Ensure all bullet points use strong action verbs and are highly ATS-friendly.
5. JD TARGETING: If the user mentions a specific Job Description (JD) or target role in the prompt, adapt the entire resume (skills, technologies, summary) to heavily match that JD.
6. TEMPLATE OVERRIDE: If the user uploads a template and says "change template to...", update their resume to follow the structure and style hints of the template.

CRITICAL INSTRUCTION: You MUST return the output STRICTLY as a JSON object matching this exact structure. Do NOT wrap it in markdown blocks, just return raw JSON:

{
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 234 567 8900",
    "linkedin": "linkedin.com/in/johndoe",
    "github": "github.com/johndoe",
    "portfolio": "johndoe.com",
    "title": "Software Engineer"
  },
  "summary": "Highly motivated and results-driven Software Engineer with...",
  "experience": [
    {
      "id": "exp-1",
      "company": "Tech Corp",
      "position": "Senior Developer",
      "startDate": "Jan 2020",
      "endDate": "Present",
      "location": "New York, NY",
      "bullets": [
        "Developed a scalable microservices architecture...",
        "Improved application performance by 40%..."
      ]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "University of Technology",
      "degree": "B.S. Computer Science",
      "startDate": "Sep 2015",
      "endDate": "May 2019",
      "location": "Boston, MA",
      "gpa": "3.8/4.0",
      "bullets": []
    }
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "E-Commerce Platform",
      "technologies": "React, Node.js, MongoDB",
      "link": "github.com/johndoe/ecommerce",
      "startDate": "2021",
      "endDate": "2022",
      "bullets": [
        "Architected a full-stack e-commerce solution...",
        "Integrated Stripe for seamless payment processing..."
      ]
    }
  ],
  "skills": [
    {
      "id": "skill-1",
      "category": "Languages",
      "items": ["JavaScript", "TypeScript", "Python"]
    },
    {
      "id": "skill-2",
      "category": "Frameworks",
      "items": ["React", "Next.js", "Express"]
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "title": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "date": "2022"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const prompt = formData.get('prompt') as string;
    const personalInfoStr = formData.get('personalInfo') as string;
    const file = formData.get('file') as File | null;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    let templateText = "";

    // Parse the template file if provided
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.name.endsWith('.pdf')) {
        templateText = await new Promise((resolve, reject) => {
          const pdfParser = new (PDFParser as any)(null, 1);
          pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
          pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            resolve((pdfParser as any).getRawTextContent());
          });
          pdfParser.parseBuffer(buffer);
        });
      } else if (file.name.endsWith('.docx')) {
        const result = await mammoth.extractRawText({ buffer });
        templateText = result.value;
      }
    }

    const systemPrompt = RESUME_PROMPT;
    const userMessage = `
User Prompt: ${prompt}

Personal Info to include: 
${personalInfoStr || "Use generic placeholders if not provided."}

${templateText ? `Sample Template to extract styling/base layout/inspiration from: \n\n${templateText}` : ""}
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const resultStr = completion.choices[0]?.message?.content;
    if (!resultStr) throw new Error("No response from AI");

    const jsonMatch = resultStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON format from AI");

    const resumeData = JSON.parse(jsonMatch[0]);

    return NextResponse.json(resumeData);
  } catch (error: any) {
    console.error("Resume generation error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate resume" }, { status: 500 });
  }
}
