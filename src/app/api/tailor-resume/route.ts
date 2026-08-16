import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import mammoth from 'mammoth';
import PDFParser from 'pdf2json';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key_for_build',
});

const TAILOR_PROMPT = `You are an elite AI ATS and expert Resume Writer. 
Your task is to rewrite, tailor, and optimize the user's provided Resume specifically for the provided Job Description (JD). 

CRITICAL INSTRUCTIONS:
1. You MUST output STRICTLY a JSON object matching the exact structure below. Do NOT wrap it in markdown blocks (\`\`\`json), just return raw JSON.
2. Rewrite the Summary to perfectly align with the JD's core requirements.
3. Rewrite the Experience and Project bullet points using strong Action Verbs. If the user's past experience was in a different role, AGGRESSIVELY REFRAME and REWRITE their past experience bullet points to sound as relevant as possible to the NEW JD role. Highlight transferable skills.
4. **100% KEYWORD MATCHING**: You MUST scan the JD for all hard skills, soft skills, and exact keyword phrases. You MUST aggressively inject these EXACT keywords into the user's Experience bullets, Projects, and Skills section to ensure the resume scores a 100% match rate in any ATS system.
5. Reorder Skills so the most relevant ones to the JD are listed first, adding any missing skills from the JD that the user implies they know.
6. Ensure the final resume is highly professional, ATS-friendly, and massively increases their chances of getting an interview.

REQUIRED JSON STRUCTURE:
{
  "personalInfo": {
    "name": "Extract or infer",
    "email": "Extract or infer",
    "phone": "Extract or infer",
    "linkedin": "Extract or infer",
    "github": "Extract or infer",
    "portfolio": "Extract or infer",
    "title": "Match to JD title if appropriate"
  },
  "summary": "Expertly rewritten summary matching JD.",
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "MM/YYYY",
      "endDate": "MM/YYYY",
      "location": "City, State",
      "bullets": [
        "Highly optimized bullet 1 with metrics and keywords.",
        "Highly optimized bullet 2 with metrics and keywords."
      ]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree",
      "startDate": "YYYY",
      "endDate": "YYYY",
      "gpa": "GPA"
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "technologies": "Tech Stack",
      "bullets": [
        "Optimized bullet highlighting relevance to JD.",
        "Optimized bullet."
      ]
    }
  ],
  "skills": [
    {
      "category": "Languages/Frameworks/Tools",
      "items": ["Skill1", "Skill2"]
    }
  ],
  "certifications": [
    {
      "title": "Cert Name",
      "issuer": "Issuer",
      "date": "YYYY"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;
    const jdText = formData.get('jd') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Resume file is required' }, { status: 400 });
    }
    if (!jdText) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    let resumeText = '';

    if (file.name.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      resumeText = result.value;
    } else if (file.name.endsWith('.pdf')) {
      resumeText = await new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, true);
        pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
        pdfParser.on('pdfParser_dataReady', (pdfData: any) => resolve(pdfParser.getRawTextContent()));
        pdfParser.parseBuffer(fileBuffer);
      });
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload PDF or DOCX.' }, { status: 400 });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from the document.' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: TAILOR_PROMPT },
        { role: 'user', content: `JOB DESCRIPTION:\n${jdText}\n\nORIGINAL RESUME:\n${resumeText}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const output = completion.choices[0]?.message?.content;
    
    if (!output) {
      throw new Error("No response from Groq");
    }

    const parsedJson = JSON.parse(output);

    return NextResponse.json(parsedJson);

  } catch (error: any) {
    console.error('Error in tailor-resume:', error);
    return NextResponse.json({ error: error.message || 'Failed to tailor resume' }, { status: 500 });
  }
}
