import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import * as xlsx from 'xlsx';
import pptxgen from 'pptxgenjs';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic, format, themeColor = '363636', fontFamily = 'Arial', diagramType = 'auto' } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }
    
    let systemPrompt = `You are an expert academic advisor. Respond directly to the user's specific request. If they ask for an abstract, use this EXACT format:\n\nTitle: [Project Title]\n\nAbstract:\n[A detailed, comprehensive paragraph, approximately half an A4 page long, explaining the project's background, methodology, and outcome]\n\nKeywords: [Comma separated keywords]\n\nIf they ask for titles only, generate only titles. If they say hi, greet them back. Do not use asterisks or markdown bolding.`;
    
    if (format === 'pptx') {
      systemPrompt = `You are an expert presentation designer. Create a comprehensive presentation based on the requested topic or outline. You MUST adapt to however many slides the user needs. Use exactly this format for each slide, separated by double newlines:\n\nSlide X\nTitle: [Slide Title]\nContent: [Bullet 1] | [Bullet 2] | [Bullet 3]\n\nDo not use any markdown formatting or asterisks.`;
    } else if (format === 'uml') {
      const typeInstruction = diagramType === 'auto' 
        ? "choose the most appropriate UML or architectural diagram type for the requested topic."
        : `specifically create a ${diagramType}.`;
        
      systemPrompt = `You are an expert software architect. Create a comprehensive diagram for the requested topic. You must ${typeInstruction}
      
CRITICAL MERMAID MAPPING RULES & EXAMPLES:
- Data Flow / System Architecture -> MUST use \`flowchart TD\`. Example:
  flowchart TD
    A[Start] --> B{Check}
    B -->|Yes| C[Process]
- Use Case Diagram -> MUST use \`flowchart LR\`. Example:
  flowchart LR
    User([User])
    subgraph System
      UC1((Login))
    end
    User --> UC1
- Class Diagram -> MUST use \`classDiagram\`. Example:
  classDiagram
    ClassA <|-- ClassB
    class ClassA {
      +int id
    }
- Sequence Diagram -> MUST use \`sequenceDiagram\`. Example:
  sequenceDiagram
    participant A
    participant B
    A->>B: Message
    B->>A: Response
  CRITICAL: Do NOT use \`alt\`, \`opt\`, or \`loop\` blocks. Just use simple straight-line sequences.
- State Machine -> MUST use \`stateDiagram-v2\`. Example:
  stateDiagram-v2
    [*] --> State1
    State1 --> State2 : transition
    note right of State1 : text
- ER Diagram -> MUST use \`erDiagram\`. Example:
  erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
      int id
      string name
    }

CRITICAL SYNTAX RULES:
1) Output ONLY valid Mermaid.js syntax.
2) You MUST wrap the diagram in a markdown code block starting with \`\`\`mermaid and ending with \`\`\`. Do NOT output any conversational text.
3) Node IDs must be strictly alphanumeric (no spaces).
4) If node labels contain spaces or special characters (e.g. parentheses), you MUST enclose the label in double quotes, e.g., A["Label Name (Info)"].
5) Use ONLY standard Mermaid arrows (e.g. \`-->\` or \`-->|Label|\`). Do NOT use invalid arrows like \`-->|Label|>\`.
6) For Class Diagrams, you MUST explicitly map out the relationships between classes using valid syntax (e.g., \`ClassA <|-- ClassB\`, \`ClassC *-- ClassD\`). Do not leave classes floating without connections.
7) CRITICAL: ONLY output the single diagram type requested. Do NOT output a flowchart AND a class diagram AND a sequence diagram. STOP generating after the first diagram block is complete.
8) For Use Case Diagrams, actors MUST be formatted as \`ActorID([Actor Name])\`. Do NOT use hyphens like \`Actor-[Actor]\`.
9) You MUST design the diagram using strict IEEE academic standards, terminology, and structural formatting.
Just return the markdown block containing the diagram.`;
    }

    // Call Groq
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: topic,
        }
      ],
      model: 'llama-3.1-8b-instant',
    });

    const result = completion.choices[0]?.message?.content || 'No abstract generated.';

    let cleanResult = result.replace(/\*\*/g, '');

    if (format === 'uml') {
      const match = cleanResult.match(/```(?:mermaid)?\s*([\s\S]*?)```/i);
      if (match) {
        cleanResult = match[1].trim();
      } else {
        const diagramKeywords = ['flowchart', 'graph', 'classDiagram', 'sequenceDiagram', 'stateDiagram', 'erDiagram', 'journey', 'gantt', 'pie'];
        const lines = cleanResult.split('\n');
        const startIndex = lines.findIndex(line => diagramKeywords.some(keyword => line.trim().startsWith(keyword)));
        if (startIndex !== -1) {
          cleanResult = lines.slice(startIndex).join('\n');
        }
      }
      cleanResult = cleanResult.trim();
      
      // Auto-fix common AI syntax hallucinations
      cleanResult = cleanResult.replace(/\|>/g, '|'); // Fixes -->|Label|>
    } else {
      cleanResult = cleanResult.replace(/```(?:mermaid)?/gi, '').replace(/```/g, '').trim();
    }

    if (format === 'text' || format === 'uml') {
      return NextResponse.json({ result: cleanResult });
    }

    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Uint8Array[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      
      const p = new Promise<Buffer>((resolve) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)));
      });

      const titleMatch = cleanResult.match(/Title:\s*([^\n]+)/i);
      const keywordsMatch = cleanResult.match(/Keywords:\s*([^\n]+)/i);
      const abstractMatch = cleanResult.match(/Abstract:\s*([\s\S]*?)(?=Keywords:|$)/i);

      if (titleMatch || abstractMatch) {
        if (titleMatch) {
          doc.font('Helvetica-Bold').fontSize(14).text("Title: " + titleMatch[1].trim(), { align: 'center' });
          doc.moveDown(1.5);
        }
        if (abstractMatch) {
          doc.font('Helvetica-Bold').fontSize(12).text("Abstract:", { align: 'center' });
          doc.moveDown(0.5);
          doc.font('Helvetica').fontSize(12).text(abstractMatch[1].trim(), { align: 'justify', lineGap: 5 });
          doc.moveDown(1.5);
        }
        if (keywordsMatch) {
          doc.font('Helvetica-Bold').fontSize(12).text("Keywords: ", { continued: true })
             .font('Helvetica').text(keywordsMatch[1].trim(), { align: 'left' });
        }
      } else {
        doc.font('Helvetica').fontSize(12).text(cleanResult, { align: 'justify', lineGap: 5 });
      }

      doc.end();
      const pdfBuffer = await p;
      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="AI_Document.pdf"',
        },
      });
    }

    if (format === 'docx') {
      const titleMatch = cleanResult.match(/Title:\s*([^\n]+)/i);
      const keywordsMatch = cleanResult.match(/Keywords:\s*([^\n]+)/i);
      const abstractMatch = cleanResult.match(/Abstract:\s*([\s\S]*?)(?=Keywords:|$)/i);

      let paragraphs: Paragraph[] = [];

      if (titleMatch || abstractMatch) {
        if (titleMatch) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: "Title: " + titleMatch[1].trim(), bold: true, size: 28 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }));
        }
        if (abstractMatch) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: "Abstract:", bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }));
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: abstractMatch[1].trim(), size: 24 })],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 400 }
          }));
        }
        if (keywordsMatch) {
          paragraphs.push(new Paragraph({
            children: [
              new TextRun({ text: "Keywords: ", bold: true, size: 24 }),
              new TextRun({ text: keywordsMatch[1].trim(), size: 24 })
            ],
            alignment: AlignmentType.LEFT
          }));
        }
      } else {
        paragraphs = cleanResult.split('\\n').map(line => new Paragraph({
          children: [new TextRun({ text: line, size: 24 })],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200 }
        }));
      }

      const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
      const buffer = await Packer.toBuffer(doc);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': 'attachment; filename="AI_Document.docx"',
        },
      });
    }

    if (format === 'xlsx') {
      const lines = cleanResult.split('\\n').map(line => [line]);
      const worksheet = xlsx.utils.aoa_to_sheet([...lines]);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "AI Content");
      
      const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="AI_Document.xlsx"',
        },
      });
    }

    if (format === 'pptx') {
      const pres = new pptxgen();
      
      // Define a custom slide layout (Master Slide)
      pres.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { color: "FFFFFF" },
        objects: [
          { rect: { x: 0, y: 0, w: "100%", h: 0.2, fill: { color: themeColor } } },
          { rect: { x: 0, y: 5.4, w: "100%", h: 0.2, fill: { color: themeColor } } },
        ]
      });

      const slides = cleanResult.split(/Slide \d+/i).filter(s => s.trim().length > 0);
      
      if (slides.length === 0) {
        const slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
        slide.addText("Generated Presentation", { x: 1, y: 1, w: '80%', h: 1, fontSize: 36, bold: true, align: 'center', color: themeColor, fontFace: fontFamily });
        slide.addText(cleanResult, { x: 1, y: 2.5, w: '80%', h: 3, fontSize: 18, align: 'left', fontFace: fontFamily });
      } else {
        slides.forEach((slideContent) => {
          const slide = pres.addSlide({ masterName: "MASTER_SLIDE" });
          const titleMatch = slideContent.match(/Title:\s*([^\n]+)/i);
          const contentMatch = slideContent.match(/Content:\s*([\s\S]+)/i);
          
          if (titleMatch) {
            slide.addText(titleMatch[1].trim(), { x: 0.5, y: 0.5, w: '90%', h: 1, fontSize: 32, bold: true, color: themeColor, fontFace: fontFamily });
          }
          if (contentMatch) {
            const bullets = contentMatch[1].split('|').map(b => b.trim()).filter(b => b.length > 0);
            slide.addText(
              bullets.map(b => ({ text: b, options: { bullet: true } })),
              { x: 0.5, y: 1.8, w: '90%', h: 3.5, fontSize: 20, color: '363636', valign: 'top', fontFace: fontFamily }
            );
          }
        });
      }

      const buffer = await pres.write({ outputType: 'nodebuffer' });
      return new NextResponse(buffer as Buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'Content-Disposition': 'attachment; filename="AI_Presentation.pptx"',
        },
      });
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
