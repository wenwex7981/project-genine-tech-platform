import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import mammoth from 'mammoth';
import PDFParser from 'pdf2json';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ATS_PROMPT = `You are an elite AI ATS (Applicant Tracking System) and expert resume reviewer. 
Your task is to analyze the candidate's resume strictly without a specific Job Description and provide a massively detailed 17-point ATS checker report.

CRITICAL INSTRUCTION: You MUST return the output STRICTLY as a JSON object matching this exact structure. Do NOT wrap it in markdown blocks, just return raw JSON:

{
  "overallScore": { "score": 85, "grade": "A", "summary": "Your resume is ATS-friendly..." },
  "contactInfo": { "name": true, "phone": true, "email": true, "linkedin": false, "github": false, "portfolio": false },
  "sections": { "summary": true, "skills": true, "experience": true, "projects": true, "education": true, "certifications": false, "achievements": false, "languages": false },
  "formatting": { "singleColumn": true, "standardFonts": true, "properHeadings": true, "noTables": true, "noTextBoxes": true, "noImages": true, "noIcons": true, "properBulletPoints": true },
  "keywordAnalysis": { "found": 28, "missing": ["Python", "SQL"], "recommended": ["REST API", "Git"] },
  "skillsAnalysis": { "technical": ["React"], "soft": ["Leadership"], "missing": [], "suggested": [] },
  "summaryReview": { "score": 8, "suggestions": "...", "exampleRewrite": "..." },
  "experienceReview": [ { "company": "Tech Corp", "strongPoints": [], "weakPoints": [], "improvedBullets": [] } ],
  "projectReview": [ { "title": "Project A", "impact": true, "metrics": false, "technologies": true, "actionVerbs": true, "suggestions": "Add metrics." } ],
  "educationReview": { "degree": true, "cgpa": true, "graduationYear": true, "formatting": true },
  "grammarLanguage": { "grammarErrors": [], "spellingErrors": [], "passiveVoice": [], "weakSentences": [] },
  "actionVerbs": { "detected": ["Developed"], "suggested": ["Engineered"] },
  "quantification": { "hasNumbers": true, "examplesFound": ["Improved by 12%"], "improvements": [] },
  "atsCompatibilityIssues": ["Icons Detected"],
  "strengths": ["Good formatting"],
  "weaknesses": ["No LinkedIn"],
  "improvementChecklist": ["Add LinkedIn", "Add metrics"]
}`;

const JD_PROMPT = `You are an elite AI ATS and expert resume writer. 
Your task is to analyze the candidate's resume against the provided Job Description (JD) and provide a massively detailed 20-point JD Match Analyzer report.
If the candidate lacks enough projects, experience, or a strong summary for the JD, you MUST provide an AI-written optimized summary, suggest specific ideal projects they should build, and suggest ideal internships or experiences they should pursue to become a 100% match.

CRITICAL INSTRUCTION: You MUST return the output STRICTLY as a JSON object matching this exact structure. Do NOT wrap it in markdown blocks, just return raw JSON:

{
  "overallMatch": { "score": 88, "recommendation": "Strong Match" },
  "resumeVsJd": { "resumeTitle": "Data Analyst", "jobTitle": "Data Scientist", "compatibility": 88 },
  "skillsMatch": { "found": ["Python"], "missing": ["Tableau"], "niceToHave": ["Docker"] },
  "keywordMatch": { "totalJdKeywords": 42, "matched": 31, "missing": ["Azure"], "matchPercentage": 74 },
  "experienceMatch": { "relevantProjects": [], "relevantInternships": [], "relevantWork": [], "missingAreas": [] },
  "educationMatch": { "degreeMatch": true, "requiredDegree": "Bachelors", "preferredDegree": "Masters" },
  "certificationsMatch": { "found": [], "missing": [], "recommended": [] },
  "responsibilitiesMatch": [ { "responsibility": "Dashboard Development", "covered": true } ],
  "projectsMatch": { "relevant": [], "weak": [], "improvements": [] },
  "missingRequirements": ["Tableau", "Azure"],
  "resumeImprovementSuggestions": ["Add SQL project"],
  "summaryRewrite": "A professional summary tailored...",
  "suggestedAdditions": {
    "projects": [ { "title": "E-Commerce Data Pipeline", "description": "Build a pipeline using Python and SQL to demonstrate ETL skills.", "reason": "Fills the gap in data engineering requested by the JD." } ],
    "experience": [ { "role": "Data Analyst Intern", "description": "Seek an internship focusing on Tableau dashboard creation.", "reason": "JD strictly requires 1+ years of Tableau visualization." } ]
  },
  "skillsReordering": ["Python", "SQL"],
  "bulletPointSuggestions": [ { "original": "Did some coding", "improved": "Engineered Python scripts..." } ],
  "atsKeywordOptimization": ["Agile"],
  "matchBreakdown": { "overall": 88, "skills": 92, "experience": 81, "education": 100, "projects": 85, "keywords": 74, "certifications": 60 },
  "interviewReadiness": { "stars": 4, "confidenceLevel": "High probability of passing." },
  "missingDocuments": ["Cover Letter"],
  "actionPlan": ["Add Tableau"],
  "copyableChanges": [ { "section": "Summary", "points": ["Copy this specific sentence into your summary."] } ],
  "optimizedResume": "The fully rewritten optimized resume in Markdown format",
  "coverLetter": "A fully tailored cover letter in Markdown format"
}`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const jd = formData.get('jd') as string;
    const mode = formData.get('mode') as string; // 'ats' or 'jd'

    if (!file) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }
    if (mode === 'jd' && !jd) {
      return NextResponse.json({ error: 'Missing Job Description' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let extractedText = '';

    if (file.name.endsWith('.pdf')) {
      extractedText = await new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, true);
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError || errData));
        pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
        pdfParser.parseBuffer(buffer);
      });
    } else if (file.name.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: 'Could not extract text.' }, { status: 400 });
    }

    const systemPrompt = mode === 'jd' ? JD_PROMPT : ATS_PROMPT;
    const userPrompt = mode === 'jd' 
      ? `=== CANDIDATE RESUME ===\n${extractedText}\n\n=== JOB DESCRIPTION ===\n${jd}`
      : `=== CANDIDATE RESUME ===\n${extractedText}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content || '{}';
    const analysisResult = JSON.parse(responseContent);
    return NextResponse.json(analysisResult);

  } catch (error: any) {
    console.error('Error in analyze-resume:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
