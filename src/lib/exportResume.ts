import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
export const generateDocx = async (resumeData: any) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            text: resumeData.personalInfo.name || "Name",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun(`${resumeData.personalInfo.email || ""} | ${resumeData.personalInfo.phone || ""}`),
              new TextRun({ text: ` | ${resumeData.personalInfo.linkedin || ""}`, break: 1 }),
            ],
          }),
          
          // Summary
          new Paragraph({ text: "SUMMARY", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
          new Paragraph({ text: resumeData.summary || "" }),

          // Experience
          ...(resumeData.experience && resumeData.experience.length > 0 ? [
            new Paragraph({ text: "EXPERIENCE", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
            ...resumeData.experience.flatMap((exp: any) => [
              new Paragraph({
                children: [
                  new TextRun({ text: `${exp.position || ""} - ${exp.company || ""}`, bold: true }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `${exp.startDate || ""} to ${exp.endDate || ""} | ${exp.location || ""}`, italics: true }),
                ],
                spacing: { after: 100 },
              }),
              ...(exp.bullets || []).map((bullet: string) => 
                new Paragraph({ text: bullet, bullet: { level: 0 } })
              ),
            ])
          ] : []),

          // Education
          ...(resumeData.education && resumeData.education.length > 0 ? [
            new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
            ...resumeData.education.flatMap((edu: any) => [
              new Paragraph({
                children: [
                  new TextRun({ text: `${edu.degree || ""} - ${edu.institution || ""}`, bold: true }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `${edu.startDate || ""} to ${edu.endDate || ""} | GPA: ${edu.gpa || ""}`, italics: true }),
                ],
              }),
            ])
          ] : []),

          // Projects
          ...(resumeData.projects && resumeData.projects.length > 0 ? [
            new Paragraph({ text: "PROJECTS", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
            ...resumeData.projects.flatMap((proj: any) => [
              new Paragraph({
                children: [
                  new TextRun({ text: proj.title || "", bold: true }),
                  new TextRun({ text: proj.technologies ? ` | ${proj.technologies}` : "", italics: true }),
                ],
              }),
              ...(proj.bullets || []).map((bullet: string) => 
                new Paragraph({ text: bullet, bullet: { level: 0 } })
              ),
            ])
          ] : []),
          
          // Skills
          ...(resumeData.skills && resumeData.skills.length > 0 ? [
            new Paragraph({ text: "SKILLS", heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 } }),
            ...resumeData.skills.map((skill: any) => 
              new Paragraph({
                children: [
                  new TextRun({ text: `${skill.category || ""}: `, bold: true }),
                  new TextRun(Array.isArray(skill.items) ? skill.items.join(", ") : ""),
                ],
              })
            )
          ] : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${resumeData.personalInfo?.name?.replace(/\s+/g, '_') || 'resume'}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const generatePdf = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const html2pdf = (await import('html2pdf.js')).default;
  
  const opt: any = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save();
};
