"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Loader2, FileText, Upload, Briefcase, CheckCircle, AlertCircle,
  AlertTriangle, Lightbulb, FileDown, Percent, Users,
  Search, Eye, Download, PlusCircle, Building, X, Trophy, FileCheck, Copy, Check
} from "lucide-react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { supabase } from "@/lib/supabase";

export default function ResumeHub() {
  const [activeTab, setActiveTab] = useState<"ats" | "jd" | "community">("ats");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // --- ANALYZER STATE ---
  const [jd, setJd] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- COMMUNITY STATE ---
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingCommunity, setLoadingCommunity] = useState(false);
  const [filterExp, setFilterExp] = useState("All");
  const [filterDomain, setFilterDomain] = useState("All");
  const [showPostModal, setShowPostModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    shortlistedBy: "",
    domain: "Software Engineering",
    experienceLevel: "Fresher",
  });

  // Reset result when switching analyzer tabs
  useEffect(() => {
    if (activeTab === "community") fetchResumes();
    else setResult(null); // clear result when switching between ATS and JD
  }, [activeTab]);

  const fetchResumes = async () => {
    setLoadingCommunity(true);
    const { data } = await supabase.from('community_resumes').select('*').order('created_at', { ascending: false });
    if (data) setResumes(data);
    setLoadingCommunity(false);
  };

  const handlePostResume = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('community_resumes').insert([{
      name: formData.name,
      contact_number: formData.contactNumber,
      shortlisted_by: formData.shortlistedBy,
      domain: formData.domain,
      experience_level: formData.experienceLevel,
      document_url: 'mock_url'
    }]);
    setIsSubmitting(false);
    if (!error) {
      setShowPostModal(false);
      fetchResumes();
      alert("Published successfully!");
    }
  };

  const filteredResumes = resumes.filter(r => {
    if (filterExp !== "All" && r.experience_level !== filterExp) return false;
    if (filterDomain !== "All" && r.domain !== filterDomain) return false;
    return true;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return alert("Please upload a resume first.");
    if (activeTab === "jd" && !jd) return alert("Please paste the Job Description.");

    setIsProcessing(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", activeTab);
    if (activeTab === "jd") formData.append("jd", jd);

    try {
      const response = await fetch('/api/analyze-resume', { method: 'POST', body: formData });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Failed to analyze resume');
      }
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const downloadDocx = async (text: string, filename: string) => {
    if (!text) return;
    const lines = text.split('\n');
    const doc = new Document({
      sections: [{
        properties: {},
        children: lines.map((line: string) => new Paragraph({
          children: [new TextRun({ text: line.replace(/\*\*/g, ''), bold: line.includes('**') })],
        })),
      }],
    });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 border-green-400 bg-green-50 dark:bg-green-900/20";
    if (score >= 60) return "text-yellow-600 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
    return "text-red-500 border-red-400 bg-red-50 dark:bg-red-900/20";
  };

  return (
    <div className="w-full min-h-screen bg-muted/10 pb-20">
      {/* Premium Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-blue-900 to-slate-950 text-white py-20 px-4 md:px-8 border-b mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold backdrop-blur-sm">
              <Briefcase className="h-4 w-4 text-blue-300" />
              <span className="text-blue-100">AI-Powered Career Engine</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Resume Hub</span></h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium">
              Maximize your callback rate. Deeply analyze your resume against a staggering 17-point ATS checklist and an exhaustive 20-point JD matching system.
            </p>
          </div>
          <div className="hidden md:flex p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl">
                <CheckCircle className="h-8 w-8 text-blue-400 mb-2" />
                <span className="text-sm font-bold">17-Pt ATS</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-white/10 rounded-xl">
                <Search className="h-8 w-8 text-indigo-400 mb-2" />
                <span className="text-sm font-bold">20-Pt Match</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 dark:bg-zinc-800 p-1.5 rounded-xl border max-w-fit">
        <button onClick={() => setActiveTab("ats")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "ats" ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}>
          <CheckCircle className="h-4 w-4" /> 17-Point ATS Checker
        </button>
        <button onClick={() => setActiveTab("jd")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "jd" ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}>
          <Search className="h-4 w-4" /> 20-Point JD Analyzer
        </button>
        <button onClick={() => setActiveTab("community")} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === "community" ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}>
          <Users className="h-4 w-4" /> Community Templates
        </button>
      </div>

      {/* -------------------- ANALYZER INPUTS -------------------- */}
      {(activeTab === "ats" || activeTab === "jd") && !result && (
        <div className="max-w-2xl mx-auto space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl border shadow-sm">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" /> 
              1. Upload Your Resume
            </h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-semibold">{file ? file.name : "Click to upload PDF or DOCX"}</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx" className="hidden" />
            </div>
          </div>

          {activeTab === "jd" && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-300">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-500" /> 
                2. Paste Job Description
              </h3>
              <textarea value={jd} onChange={(e) => setJd(e.target.value)} placeholder="Paste the full job description here..." className="w-full min-h-[200px] p-4 rounded-xl border bg-background resize-none" />
            </div>
          )}

          <Button onClick={handleAnalyze} disabled={!file || (activeTab === "jd" && !jd) || isProcessing} size="lg" className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-700 text-white">
            {isProcessing ? <><Loader2 className="mr-2 h-6 w-6 animate-spin" /> Deep Scanning...</> : <><Percent className="mr-2 h-6 w-6" /> Run Full Analysis</>}
          </Button>
        </div>
      )}

      {/* -------------------- 17-POINT ATS REPORT -------------------- */}
      {activeTab === "ats" && result && (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border shadow-sm space-y-10 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="flex justify-between items-start border-b pb-8">
            <div>
              <h2 className="text-3xl font-extrabold flex items-center gap-3"><FileCheck className="text-indigo-600 h-8 w-8" /> ATS Checker Report</h2>
              <p className="text-gray-500 mt-2">17-Point comprehensive analysis of your resume structure.</p>
            </div>
            <Button variant="outline" onClick={() => setResult(null)}>Analyze Another</Button>
          </div>

          {/* 1. Overall Score */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-2xl border">
            <div className={`shrink-0 h-32 w-32 rounded-full border-8 flex flex-col items-center justify-center ${getScoreColor(result.overallScore?.score || 0)}`}>
              <span className="text-4xl font-extrabold">{result.overallScore?.score || 0}%</span>
              <span className="text-xs font-bold uppercase">Grade {result.overallScore?.grade || 'N/A'}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">1. Overall ATS Score</h3>
              <p className="text-gray-600 dark:text-gray-400">{result.overallScore?.summary}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 2. Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">2. Contact Information</h3>
              <ul className="space-y-2 text-sm">
                {Object.entries(result.contactInfo || {}).map(([key, val]) => (
                  <li key={key} className="flex justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded">
                    <span className="capitalize">{key}</span>
                    {val ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* 3. Sections */}
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">3. Resume Sections</h3>
              <ul className="space-y-2 text-sm grid grid-cols-2 gap-2">
                {Object.entries(result.sections || {}).map(([key, val]) => (
                  <li key={key} className="flex justify-between p-2 bg-gray-50 dark:bg-zinc-800 rounded">
                    <span className="capitalize">{key}</span>
                    {val ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Formatting */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">4. ATS Formatting Checks</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(result.formatting || {}).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50 dark:bg-zinc-800 text-sm font-semibold">
                  {val ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5 & 6. Keywords & Skills */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">5. Keyword Analysis (Found: {result.keywordAnalysis?.found || 0})</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-red-600 mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">{result.keywordAnalysis?.missing?.map((k: string) => <span key={k} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md">{k}</span>)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-600 mb-2">Recommended Keywords</h4>
                  <div className="flex flex-wrap gap-2">{result.keywordAnalysis?.recommended?.map((k: string) => <span key={k} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">{k}</span>)}</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">6. Skills Analysis</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-green-600 mb-2">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">{result.skillsAnalysis?.technical?.map((k: string) => <span key={k} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">{k}</span>)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-purple-600 mb-2">Soft Skills</h4>
                  <div className="flex flex-wrap gap-2">{result.skillsAnalysis?.soft?.map((k: string) => <span key={k} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">{k}</span>)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Summary Review */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200">
            <h3 className="text-lg font-bold mb-2 text-blue-900 dark:text-blue-100">7. Summary Review (Score: {result.summaryReview?.score || 0}/10)</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">{result.summaryReview?.suggestions}</p>
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-blue-200 text-sm">
              <span className="font-bold text-xs uppercase text-blue-500 block mb-1">Example Rewrite:</span>
              {result.summaryReview?.exampleRewrite}
            </div>
          </div>

          {/* 8 & 9. Experience & Projects */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-b pb-2">8. Experience Review</h3>
            {result.experienceReview?.map((exp: any, i: number) => (
              <div key={i} className="p-4 border rounded-xl bg-gray-50 dark:bg-zinc-800/50">
                <h4 className="font-bold mb-3">{exp.company}</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-green-600">Strong Points:</strong>
                    <ul className="list-disc pl-5 mt-1">{exp.strongPoints?.map((p: string, j: number) => <li key={j}>{p}</li>)}</ul>
                  </div>
                  <div>
                    <strong className="text-red-600">Weak Points:</strong>
                    <ul className="list-disc pl-5 mt-1">{exp.weakPoints?.map((p: string, j: number) => <li key={j}>{p}</li>)}</ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 11-14. Grammar, Verbs, Quant, Issues */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">12. Action Verbs</h3>
              <p className="text-sm mb-2"><strong className="text-green-600">Detected:</strong> {result.actionVerbs?.detected?.join(', ')}</p>
              <p className="text-sm"><strong className="text-blue-600">Suggested:</strong> {result.actionVerbs?.suggested?.join(', ')}</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">13. Quantification</h3>
              <p className="text-sm mb-2">Has Numbers: {result.quantification?.hasNumbers ? '✅ Yes' : '❌ No'}</p>
              <ul className="text-sm list-disc pl-5">{result.quantification?.examplesFound?.map((e: string, i: number) => <li key={i}>{e}</li>)}</ul>
            </div>
          </div>

          {/* 17. Checklist */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-200">
            <h3 className="text-lg font-bold mb-4 text-indigo-900 dark:text-indigo-100 flex items-center gap-2"><CheckCircle className="h-5 w-5" /> 17. Improvement Checklist</h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm font-semibold text-indigo-800 dark:text-indigo-200">
              {result.improvementChecklist?.map((item: string, i: number) => (
                <label key={i} className="flex items-center gap-2 bg-white dark:bg-zinc-800 p-3 rounded-lg border">
                  <input type="checkbox" className="w-4 h-4 rounded text-indigo-600" />
                  {item}
                </label>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* -------------------- 20-POINT JD REPORT -------------------- */}
      {activeTab === "jd" && result && (
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border shadow-sm space-y-10 animate-in fade-in zoom-in-95 duration-500">
          
          <div className="flex justify-between items-start border-b pb-8">
            <div>
              <h2 className="text-3xl font-extrabold flex items-center gap-3"><Search className="text-indigo-600 h-8 w-8" /> JD Match Analyzer</h2>
              <p className="text-gray-500 mt-2">20-Point deep analysis against your target Job Description.</p>
            </div>
            <div className="flex gap-2">
              {result.optimizedResume && (
                <Button onClick={() => downloadDocx(result.optimizedResume, "Optimized_Resume.docx")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <FileDown className="mr-2 h-4 w-4" /> Optimized Resume
                </Button>
              )}
              {result.coverLetter && (
                <Button variant="outline" onClick={() => downloadDocx(result.coverLetter, "Cover_Letter.docx")}>
                  <FileDown className="mr-2 h-4 w-4" /> Cover Letter
                </Button>
              )}
              <Button variant="ghost" onClick={() => setResult(null)}><X className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* 1 & 2. Overall Match & Resume vs JD */}
          <div className="flex flex-col md:flex-row items-center gap-8 bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-2xl border border-indigo-100">
            <div className={`shrink-0 h-36 w-36 rounded-full border-8 flex flex-col items-center justify-center ${getScoreColor(result.overallMatch?.score || 0)}`}>
              <span className="text-5xl font-extrabold">{result.overallMatch?.score || 0}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Match Score</span>
            </div>
            <div className="flex-grow space-y-4 w-full">
              <h3 className="text-2xl font-bold">1. {result.overallMatch?.recommendation}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm bg-white dark:bg-zinc-800 p-4 rounded-xl border">
                <div><span className="text-gray-500 block">Your Resume Title</span><strong className="text-lg">{result.resumeVsJd?.resumeTitle}</strong></div>
                <div><span className="text-gray-500 block">Target Job Title</span><strong className="text-lg">{result.resumeVsJd?.jobTitle}</strong></div>
              </div>
            </div>
          </div>

          {/* 16. Match Breakdown */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">16. Match Breakdown</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
              {Object.entries(result.matchBreakdown || {}).map(([key, val]) => (
                <div key={key} className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-xl border">
                  <span className={`text-xl font-bold block ${Number(val) > 75 ? 'text-green-600' : 'text-amber-600'}`}>{val}%</span>
                  <span className="text-xs text-gray-500 uppercase font-semibold capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 & 4. Skills & Keywords */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">3. Skills Match</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-green-600 mb-1">Skills Found</h4>
                  <div className="flex flex-wrap gap-1">{result.skillsMatch?.found?.map((k: string) => <span key={k} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">{k}</span>)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-600 mb-1">Missing Skills</h4>
                  <div className="flex flex-wrap gap-1">{result.skillsMatch?.missing?.map((k: string) => <span key={k} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">{k}</span>)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-blue-600 mb-1">Nice-to-Have</h4>
                  <div className="flex flex-wrap gap-1">{result.skillsMatch?.niceToHave?.map((k: string) => <span key={k} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{k}</span>)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4 border-b pb-2">4. Keyword Match</h3>
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border space-y-2 text-sm">
                <div className="flex justify-between"><span>Total JD Keywords:</span><strong>{result.keywordMatch?.totalJdKeywords}</strong></div>
                <div className="flex justify-between"><span>Keywords Matched:</span><strong className="text-green-600">{result.keywordMatch?.matched}</strong></div>
                <div className="flex justify-between"><span>Keywords Missing:</span><strong className="text-red-600">{result.keywordMatch?.missing?.length || 0}</strong></div>
                <div className="pt-2 mt-2 border-t flex justify-between font-bold"><span>Keyword Score:</span><span>{result.keywordMatch?.matchPercentage}%</span></div>
              </div>
            </div>
          </div>

          {/* 8. Responsibilities */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">8. Responsibilities Match</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              {result.responsibilitiesMatch?.map((req: any, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg border">
                  {req.covered ? <CheckCircle className="h-5 w-5 text-green-500 shrink-0" /> : <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />}
                  <span className={req.covered ? "text-gray-800 dark:text-gray-200" : "text-gray-500"}>{req.responsibility}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 14. Bullet Point Suggestions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b pb-2">14. Bullet Point Suggestions</h3>
            <div className="space-y-4">
              {result.bulletPointSuggestions?.map((bullet: any, i: number) => (
                <div key={i} className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl border text-sm">
                  <div>
                    <span className="text-xs font-bold uppercase text-red-500 block mb-1">Original Bullet</span>
                    <p className="line-through opacity-70">{bullet.original}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-green-500 block mb-1">JD-Optimized Bullet</span>
                    <p className="font-medium text-green-800 dark:text-green-200">{bullet.improved}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Generated Summary & Suggestions */}
          <div className="space-y-8 pt-6 border-t">
            {result.summaryRewrite && (
              <div className="bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-200">
                <h3 className="text-lg font-bold flex items-center gap-2 text-blue-800 dark:text-blue-300 mb-3">
                  <Lightbulb className="h-5 w-5" /> AI-Generated Summary Rewrite
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Your current summary is weak for this JD. Use this AI-optimized summary instead:</p>
                <div className="relative group">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100 bg-white dark:bg-zinc-800 p-4 rounded-xl border shadow-sm">
                    {result.summaryRewrite}
                  </p>
                  <button onClick={() => handleCopy(result.summaryRewrite)} className="absolute top-2 right-2 p-2 bg-gray-100 dark:bg-zinc-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {copiedText === result.summaryRewrite ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {result.suggestedAdditions && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2"><PlusCircle className="text-indigo-600 h-6 w-6" /> Resume Gap Fillers (Suggested by AI)</h3>
                <p className="text-sm text-gray-500">You don't have enough projects or experience for this JD. The AI recommends building or acquiring these exactly:</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Suggested Projects */}
                  {result.suggestedAdditions.projects && result.suggestedAdditions.projects.length > 0 && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-2xl border border-indigo-100">
                      <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 border-b border-indigo-200 pb-2">Suggested Projects to Build</h4>
                      <div className="space-y-4">
                        {result.suggestedAdditions.projects.map((proj: any, i: number) => (
                          <div key={i} className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm text-sm border">
                            <strong className="block text-base text-indigo-700 dark:text-indigo-400 mb-1">{proj.title}</strong>
                            <p className="mb-2 text-gray-700 dark:text-gray-300">{proj.description}</p>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Why: {proj.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Experience */}
                  {result.suggestedAdditions.experience && result.suggestedAdditions.experience.length > 0 && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100">
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-4 border-b border-emerald-200 pb-2">Suggested Internships/Roles to Pursue</h4>
                      <div className="space-y-4">
                        {result.suggestedAdditions.experience.map((exp: any, i: number) => (
                          <div key={i} className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm text-sm border">
                            <strong className="block text-base text-emerald-700 dark:text-emerald-400 mb-1">{exp.role}</strong>
                            <p className="mb-2 text-gray-700 dark:text-gray-300">{exp.description}</p>
                            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Why: {exp.reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 21. Direct Copy-Paste Changes */}
          {result.copyableChanges && result.copyableChanges.length > 0 && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Copy className="h-5 w-5" /> Copy & Paste Ready Changes
              </h3>
              <p className="text-sm text-gray-500 mb-4">Directly copy these optimized points into your resume to instantly boost your ATS score.</p>
              
              <div className="grid gap-6">
                {result.copyableChanges.map((change: any, i: number) => (
                  <div key={i} className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 overflow-hidden">
                    <div className="bg-indigo-100/50 dark:bg-indigo-900/30 px-4 py-2 border-b border-indigo-100 font-bold text-sm text-indigo-800 dark:text-indigo-200 uppercase tracking-wider">
                      {change.section} Section
                    </div>
                    <ul className="p-4 space-y-3">
                      {change.points?.map((point: string, j: number) => (
                        <li key={j} className="flex gap-4 items-start group">
                          <div className="flex-grow text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            {point}
                          </div>
                          <button 
                            onClick={() => handleCopy(point)}
                            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold text-indigo-600 bg-white border border-indigo-200 shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            {copiedText === point ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                            {copiedText === point ? "Copied!" : "Copy"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 17. Interview Readiness */}
          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 flex items-center gap-6">
            <div className="text-amber-500 flex text-4xl">
              {"★".repeat(result.interviewReadiness?.stars || 0)}{"☆".repeat(5 - (result.interviewReadiness?.stars || 0))}
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">17. Interview Readiness</h3>
              <p className="text-amber-800 dark:text-amber-200 text-sm mt-1">{result.interviewReadiness?.confidenceLevel}</p>
            </div>
          </div>

          {/* 19. Action Plan */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b pb-2">19. Action Plan to hit 100%</h3>
            <div className="grid sm:grid-cols-3 gap-3 text-sm font-semibold">
              {result.actionPlan?.map((item: string, i: number) => (
                <label key={i} className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200 p-3 rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-100">
                  <input type="checkbox" className="w-4 h-4 rounded text-indigo-600" />
                  {item}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- COMMUNITY TEMPLATES -------------------- */}
      {activeTab === "community" && (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Winning Resumes</h2>
            <Button onClick={() => setShowPostModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
              <PlusCircle className="mr-2 h-4 w-4" /> Publish Yours
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 mb-8 bg-white dark:bg-zinc-900 p-4 rounded-xl border">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-500">Experience:</span>
              {["All", "Fresher", "Experienced"].map(level => (
                <button 
                  key={level} onClick={() => setFilterExp(level)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterExp === level ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}
                >{level}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 border-l pl-4 ml-2">
              <span className="text-sm font-semibold text-gray-500">Domain:</span>
              {["All", "Software Engineering", "Data Science", "Product Management", "Design"].map(domain => (
                <button 
                  key={domain} onClick={() => setFilterDomain(domain)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterDomain === domain ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}
                >{domain}</button>
              ))}
            </div>
          </div>

          {loadingCommunity ? (
            <div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-indigo-500" /></div>
          ) : filteredResumes.length === 0 ? (
            <div className="text-center p-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed">
              <h3 className="text-xl font-bold">No resumes found</h3>
              <p className="text-gray-500 mt-2">Be the first to publish a resume in this category!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <div key={resume.id} className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm flex flex-col">
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${resume.experience_level === 'Fresher' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {resume.experience_level}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{resume.domain}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{resume.name}</h3>
                    <div className="flex items-center gap-2 mt-4 text-sm bg-blue-50 p-3 rounded-lg">
                      <Building className="h-5 w-5 text-blue-500" />
                      <div>
                        <span className="block text-xs font-semibold uppercase text-blue-400">Shortlisted By</span>
                        <span className="font-bold text-gray-800">{resume.shortlisted_by}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 border-t divide-x">
                    <button className="py-4 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"><Eye className="h-4 w-4" /> Preview</button>
                    <button className="py-4 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50"><Download className="h-4 w-4" /> Download</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* POST MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold flex items-center gap-2"><PlusCircle className="text-indigo-600" /> Publish Resume</h2>
              <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-gray-800"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handlePostResume} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Candidate Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Contact Number</label>
                  <input required value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Shortlisted By (Company)</label>
                <input required value={formData.shortlistedBy} onChange={e => setFormData({...formData, shortlistedBy: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Domain</label>
                  <select value={formData.domain} onChange={e => setFormData({...formData, domain: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800">
                    <option>Software Engineering</option>
                    <option>Data Science</option>
                    <option>Product Management</option>
                    <option>Design</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Experience Level</label>
                  <select value={formData.experienceLevel} onChange={e => setFormData({...formData, experienceLevel: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800">
                    <option>Fresher</option>
                    <option>Experienced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Upload Resume Document</label>
                <input type="file" accept=".pdf,.docx" required className="w-full p-3 rounded-xl border bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700" />
              </div>
              <div className="pt-4 mt-2 border-t">
                <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 text-white">
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Publish to Community"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
