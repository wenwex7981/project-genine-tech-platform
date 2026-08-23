"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Download, Sparkles, Workflow } from "lucide-react";
import * as htmlToImage from 'html-to-image';
import { ModelSelector, AIModel } from "@/components/ModelSelector";

type Format = "text" | "pdf" | "docx" | "xlsx" | "pptx" | "uml";

export default function AIHelper() {
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState<Format>("text");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [themeColor, setThemeColor] = useState("363636");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [diagramType, setDiagramType] = useState("auto");
  const [preferredModel, setPreferredModel] = useState<AIModel>("deepseek");
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (format === 'uml' && resultText && mermaidRef.current) {
      import('mermaid').then((m) => {
        m.default.initialize({ startOnLoad: false, theme: 'default' });
        m.default.render('mermaid-svg', resultText).then(({ svg }) => {
          if (svg.includes('Syntax error') || svg.includes('mermaid-error')) {
            throw new Error('Mermaid syntax error');
          }
          mermaidRef.current!.innerHTML = svg;
        }).catch((err) => {
          console.error("Mermaid error:", err);
          mermaidRef.current!.innerHTML = '<div class="text-red-500 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 mt-4 text-sm font-semibold">⚠️ AI generated invalid diagram syntax. Please try generating it again with a slightly different prompt to help the AI format it correctly.</div>';
        });
      });
    }
  }, [resultText, format]);

  const handleGenerate = async () => {
    if (!topic) return;
    
    setIsGenerating(true);
    setResultText(null);
    
    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, format, themeColor, fontFamily, diagramType, preferredModel }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to generate document');
      }

      if (format === "text" || format === "uml") {
        const data = await response.json();
        setResultText(data.result);
      } else {
        // Handle file download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Define file extension
        let ext = format;
        if (format === "pdf") ext = "pdf";
        if (format === "docx") ext = "docx";
        if (format === "xlsx") ext = "xlsx";
        if (format === "pptx") ext = "pptx";
        
        a.download = `AI_Generated_Document.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error: any) {
      console.error('Error generating document:', error);
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadUML = () => {
    if (!mermaidRef.current) return;
    const svgElement = mermaidRef.current.querySelector('svg');
    if (!svgElement) {
      alert("No diagram to download or still rendering.");
      return;
    }
    
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = "UML_Diagram.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = async () => {
    if (!mermaidRef.current) return;
    const svgElement = mermaidRef.current.querySelector('svg');
    if (!svgElement) {
      alert("No diagram to download or still rendering.");
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(mermaidRef.current, { backgroundColor: 'white', pixelRatio: 2 });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "UML_Diagram.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error generating PNG:', error);
      alert("Failed to render image as PNG. Please download as SVG.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-lg p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="ai-topic" className="block text-sm font-semibold mb-2">Project Topic or Keywords</label>
            <textarea 
              id="ai-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., E-commerce website for local farmers using React and Node.js..."
              className="w-full min-h-[100px] p-4 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-2 w-full">
              <label className="block text-sm font-semibold">Output Format</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat("text")}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${format === "text" ? "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 ring-2 ring-zinc-500/20" : "bg-card hover:bg-muted/50 border-border"}`}
                >
                  <FileText className="h-5 w-5" />
                  <span className="font-medium text-sm">Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("pdf")}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${format === "pdf" ? "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 ring-2 ring-orange-500/20" : "bg-card hover:bg-muted/50 border-border hover:border-orange-200/50"}`}
                >
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                    <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="font-medium text-sm">PDF File</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormat("docx")}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${format === "docx" ? "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 ring-2 ring-blue-500/20" : "bg-card hover:bg-muted/50 border-border hover:border-blue-200/50"}`}
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-sm">Word DOCX</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat("pptx")}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${format === "pptx" ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 ring-2 ring-red-500/20" : "bg-card hover:bg-muted/50 border-border hover:border-red-200/50"}`}
                >
                  <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                    <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="font-medium text-sm">PowerPoint</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormat("xlsx")}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${format === "xlsx" ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 ring-2 ring-green-500/20" : "bg-card hover:bg-muted/50 border-border hover:border-green-200/50"}`}
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium text-sm">Excel XLSX</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat("uml")}
                  className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${format === "uml" ? "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 ring-2 ring-purple-500/20" : "bg-card hover:bg-muted/50 border-border hover:border-purple-200/50"}`}
                >
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <Workflow className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium text-sm">UML Diagram</span>
                </button>
              </div>
            </div>

            {format === 'pptx' && (
              <div className="mt-2 p-4 border rounded-xl bg-muted/30 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Theme Color</label>
                  <select 
                    value={themeColor} 
                    onChange={(e) => setThemeColor(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  >
                    <option value="363636">Professional Dark (Default)</option>
                    <option value="003366">Corporate Blue</option>
                    <option value="800000">Crimson Red</option>
                    <option value="004d00">Forest Green</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Font Style</label>
                  <select 
                    value={fontFamily} 
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  >
                    <option value="Arial">Arial (Default)</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
              </div>
            )}

            {format === 'uml' && (
              <div className="mt-2 p-4 border rounded-xl bg-muted/30 animate-in slide-in-from-top-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Diagram Type</label>
                  <select 
                    value={diagramType} 
                    onChange={(e) => setDiagramType(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  >
                    <option value="auto">Auto-detect from Prompt (Recommended)</option>
                    <option value="Use Case Diagram">Use Case Diagram</option>
                    <option value="Class Diagram">Class Diagram</option>
                    <option value="Activity Diagram">Activity Diagram</option>
                    <option value="Sequence Diagram">Sequence Diagram</option>
                    <option value="ER Diagram">Entity Relationship (ER) Diagram</option>
                    <option value="State Diagram">State Machine Diagram</option>
                    <option value="Data Flow Diagram">Data Flow Diagram (DFD)</option>
                    <option value="System Architecture">System Architecture Diagram</option>
                  </select>
                </div>
              </div>
            )}

            <div className="mt-2">
              <ModelSelector value={preferredModel} onChange={setPreferredModel} />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={!topic || isGenerating}
              size="lg"
              className="w-full h-12 text-lg shadow-md mt-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : format === "text" || format === "uml" ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate {format === "uml" ? "Diagram" : "Text"}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Download {format.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </div>

        {resultText && format === "text" && (
          <div className="mt-8 pt-8 border-t animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generated Result
            </h3>
            <div 
              className="p-6 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 whitespace-pre-wrap leading-relaxed"
              dangerouslySetInnerHTML={{ __html: resultText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(resultText)}>Copy to Clipboard</Button>
            </div>
          </div>
        )}

        {resultText && format === "uml" && (
          <div className="mt-8 pt-8 border-t animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Workflow className="h-5 w-5 text-purple-500" />
              UML Diagram
            </h3>
            <div className="p-6 rounded-xl bg-white dark:bg-zinc-800 border overflow-auto flex justify-center items-center min-h-[300px]">
              <div ref={mermaidRef} className="mermaid-container" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={handleDownloadUML}>
                <Download className="mr-2 h-4 w-4" />
                Download SVG
              </Button>
              <Button variant="default" onClick={handleDownloadPNG}>
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
