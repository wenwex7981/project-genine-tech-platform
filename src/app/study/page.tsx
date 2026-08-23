"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { 
  GraduationCap, BookOpen, Map, CheckCircle, CheckCircle2, Loader2, 
  FileText, Lock, ShoppingCart, ExternalLink, Target, Cpu, Layers, 
  Download, Copy, BarChart3, Search, Sparkles, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { ModelSelector, AIModel } from "@/components/ModelSelector";

export default function StudyHubPage() {
  // Main Tab State: Default is "interview-prep" as requested
  const [activeTab, setActiveTab] = useState<"interview-prep" | "ai-roadmap">("interview-prep");

  // --- AI Career Guidance State ---
  const [goal, setGoal] = useState("");
  const [background, setBackground] = useState("");
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [roadmap, setRoadmap] = useState("");
  const [activeView, setActiveView] = useState<"text" | "visual">("text");
  const [preferredModel, setPreferredModel] = useState<AIModel>("deepseek");
  const roadmapRef = useRef<HTMLDivElement>(null);

  // --- Interview Prep Documents State ---
  const [docs, setDocs] = useState<any[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("All");
  const { addToCart, cart } = useCart();

  useEffect(() => {
    async function fetchInterviewDocs() {
      try {
        const { data: interviewDocs, error } = await supabase
          .from("interview_prep_docs")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) console.error(error);
        setDocs(interviewDocs || []);

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (session.user.email === "admin@graduatenex.online") {
             setIsAdmin(true);
          }
          const { data: orders } = await supabase
            .from("orders")
            .select("items")
            .eq("user_email", session.user.email);
          
          const ids: string[] = [];
          (orders || []).forEach((order: any) => {
            (order.items || []).forEach((item: any) => ids.push(String(item.id)));
          });
          setPurchasedIds(ids);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingDocs(false);
      }
    }
    fetchInterviewDocs();
  }, []);

  // AI Roadmap Generator Handler
  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal) return;
    setIsLoadingRoadmap(true);
    setRoadmap("");
    try {
      const res = await fetch("/api/career-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal, background, preferredModel }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setRoadmap(data.roadmap);
    } catch (error) {
      alert("Error generating roadmap. Please try again.");
    } finally {
      setIsLoadingRoadmap(false);
    }
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !roadmap) return;

    const htmlContent = roadmap
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/^\* (.+)$/gm, "<li>$1</li>")
      .replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>")
      .replace(/((<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>")
      .replace(/\n\n/g, "</p><p>")
      .replace(/^(?!<[hul]).+/gm, (m) => m ? m : "");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Career Roadmap - ${goal}</title>
        <meta charset="utf-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; color: #111; line-height: 1.8; }
          .header { border-bottom: 3px solid #4f46e5; padding-bottom: 16px; margin-bottom: 28px; }
          .header h1 { font-size: 26px; font-weight: 900; color: #4f46e5; }
          .header p { color: #6b7280; font-size: 13px; margin-top: 6px; }
          h2 { font-size: 18px; font-weight: 700; color: #1e1b4b; margin: 24px 0 10px; padding-left: 10px; border-left: 4px solid #4f46e5; }
          h3 { font-size: 15px; font-weight: 600; color: #312e81; margin: 16px 0 6px; }
          p { margin-bottom: 10px; color: #374151; }
          ul { padding-left: 22px; margin: 8px 0 16px; }
          li { margin-bottom: 5px; color: #374151; }
          strong { font-weight: 700; color: #111827; }
          .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 11px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Career Roadmap: ${goal}</h1>
          <p>Generated by GraduateNex AI Career Coach &bull; Background: ${background || "Recent Graduate"}</p>
        </div>
        <div>${htmlContent}</div>
        <div class="footer">Generated by GraduateNex &bull; graduatenex.online</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 600);
  };

  const parseVisualPhases = (text: string) => {
    const lines = text.split("\n");
    const phases: { title: string; items: string[]; description: string }[] = [];
    let current: { title: string; items: string[]; description: string } | null = null;
    let inList = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const isHeader = trimmed.startsWith("##") || trimmed.startsWith("###");
      const isBoldPhase = trimmed.startsWith("**Phase") || trimmed.startsWith("**Month") || trimmed.startsWith("**Step");

      if (isHeader || isBoldPhase) {
        const titleText = trimmed.replace(/^#+\s*/, "").replace(/\*\*/g, "").trim();
        if (titleText.toLowerCase().includes("overview") || titleText.toLowerCase() === "career roadmap") continue;

        if (current && (current.items.length > 0 || current.description)) {
          phases.push(current);
        }
        current = { title: titleText, items: [], description: "" };
        inList = false;
      } else if (trimmed.startsWith("-") || trimmed.startsWith("* ") || trimmed.match(/^\d+\.\s/)) {
        if (current) {
          const itemText = trimmed.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "").replace(/\*\*/g, "").trim();
          if (itemText) {
            current.items.push(itemText);
          }
          inList = true;
        }
      } else {
        if (current && !inList && !current.description) {
          current.description = trimmed.replace(/\*\*/g, "");
        }
      }
    }
    if (current && (current.items.length > 0 || current.description)) phases.push(current);

    return phases.filter(p => p.items.length > 0 || p.description.length > 10);
  };

  const phaseColors = [
    "from-violet-500 to-indigo-600",
    "from-indigo-500 to-blue-600",
    "from-blue-500 to-cyan-600",
    "from-cyan-500 to-teal-600",
    "from-teal-500 to-emerald-600",
  ];

  const phases = roadmap ? parseVisualPhases(roadmap) : [];

  // Filter docs
  const isInCart = (id: string) => cart.some(c => String(c.id) === String(id));
  const isPurchased = (id: string) => purchasedIds.includes(String(id));

  const handleAddToCart = (doc: any) => {
    addToCart({
      id: doc.id,
      title: `${doc.company_name} - ${doc.title}`,
      price: doc.price,
      quantity: 1,
      image_url: doc.image_url,
      file_url: doc.file_url
    });
  };

  const companiesList = ["All", ...Array.from(new Set(docs.map(d => d.company_name).filter(Boolean)))];

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = selectedCompany === "All" || doc.company_name === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  return (
    <div className="min-h-screen bg-muted/20 pb-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 text-white py-20 border-b relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-indigo-200 font-bold text-sm mb-6 border border-white/20 backdrop-blur-md">
            <GraduationCap className="h-4 w-4 text-purple-300" /> The Ultimate Study & Career Hub
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-amber-300">Career & Interviews</span>
          </h1>
          <p className="text-xl text-indigo-100 mb-10 leading-relaxed max-w-3xl mx-auto">
            Access real interview question banks asked by Deloitte, FAANG & top companies, or generate custom AI learning roadmaps.
          </p>

          {/* Prominent Visible Tab Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab("interview-prep")}
              className={`h-14 px-8 text-base font-extrabold rounded-2xl transition-all duration-200 flex items-center gap-3 shadow-lg cursor-pointer ${
                activeTab === "interview-prep"
                  ? "bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 scale-105"
                  : "bg-white/15 text-white hover:bg-white/25 border border-white/30 backdrop-blur-md"
              }`}
            >
              <BookOpen className="h-5 w-5" /> Premium Interview Question Banks ({docs.length})
            </button>

            <button
              onClick={() => setActiveTab("ai-roadmap")}
              className={`h-14 px-8 text-base font-extrabold rounded-2xl transition-all duration-200 flex items-center gap-3 shadow-lg cursor-pointer ${
                activeTab === "ai-roadmap"
                  ? "bg-purple-600 text-white ring-4 ring-purple-500/30 scale-105"
                  : "bg-white/15 text-white hover:bg-white/25 border border-white/30 backdrop-blur-md"
              }`}
            >
              <Sparkles className="h-5 w-5" /> AI Career Roadmap Generator
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 md:px-6 mt-12 max-w-7xl">

        {/* TAB 1: INTERVIEW PREP DOCUMENTS CATALOG (DEFAULT) */}
        {activeTab === "interview-prep" && (
          <section className="animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-bold mb-2">
                  <BookOpen className="w-3.5 h-3.5" /> Complete Question Banks
                </div>
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-indigo-600" />
                  Premium Interview Question Banks
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Real questions, coding challenges & solution guides asked by top MNCs and tech companies.
                </p>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search documents by company or role (e.g. Deloitte, Java, SDE)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-muted/20 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedCompany}
                  onChange={e => setSelectedCompany(e.target.value)}
                  className="p-2.5 rounded-xl border bg-muted/20 text-sm font-semibold outline-none cursor-pointer w-full sm:w-auto"
                >
                  {companiesList.map(c => (
                    <option key={c} value={c}>{c === "All" ? "All Companies" : c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Documents Grid */}
            {isLoadingDocs ? (
              <div className="flex justify-center p-20">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="text-center p-16 bg-white dark:bg-zinc-900 border rounded-3xl">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
                <h3 className="text-xl font-bold mb-2">No Documents Found</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your search query or filter.</p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDocs.map((doc) => {
                  const purchased = isPurchased(doc.id);
                  const inCart = isInCart(doc.id);

                  return (
                    <div
                      key={doc.id}
                      className="bg-white dark:bg-zinc-900 border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                      {/* Preview Image / Blur Header */}
                      <div className="relative h-64 bg-gray-100 dark:bg-zinc-800 overflow-hidden border-b">
                        {doc.image_url ? (
                          <>
                            <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden">
                              <img src={doc.image_url} alt={doc.title} className="w-full object-cover object-top" />
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden">
                              <img src={doc.image_url} alt="" className="w-full object-cover object-top blur-md scale-110 opacity-60" style={{ marginTop: "-50%" }} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-center gap-2">
                                {purchased ? (
                                  <div className="text-white flex flex-col items-center gap-1">
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                    <span className="text-xs font-bold bg-green-500/30 px-3 py-1 rounded-full border border-green-400">Unlocked</span>
                                  </div>
                                ) : (
                                  <div className="text-white flex flex-col items-center gap-1">
                                    <Lock className="w-7 h-7 text-amber-300" />
                                    <span className="text-xs font-bold bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/30">
                                      Preview Locked
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full flex-col gap-2 p-4 w-full">
                            <FileText className="w-12 h-12 text-indigo-400 opacity-40 shrink-0" />
                            <span className="text-xs font-bold text-muted-foreground w-full truncate text-center">{doc.company_name} Prep Guide</span>
                          </div>
                        )}

                        {/* Floating Badges */}
                        <div className="absolute top-4 left-4 bg-indigo-600 text-white font-bold px-3 py-1 rounded-xl text-xs shadow max-w-[70%] truncate">
                          {doc.company_name}
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur text-foreground font-black px-3 py-1 rounded-xl shadow border text-sm">
                          {purchased ? "✓ Unlocked" : `₹${doc.price}`}
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-bold text-xl mb-2 line-clamp-2">{doc.title}</h3>
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-2 flex-1">
                          {doc.description || "Comprehensive interview preparation document with solutions and technical guidance."}
                        </p>

                        {/* Action Button */}
                        <div className="mt-auto">
                          {isAdmin ? (
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-2">
                                <a
                                  href={doc.file_url === "pending" ? `/view/${doc.id}` : doc.file_url}
                                  target={doc.file_url === "pending" ? "_self" : "_blank"}
                                  rel="noreferrer"
                                  className="flex-1 block"
                                >
                                  <Button className="w-full font-bold h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center">
                                    <ExternalLink className="w-4 h-4 mr-1" /> View
                                  </Button>
                                </a>
                                <Link href={`/admin/study/${doc.id}/edit`} className="flex-1 block">
                                  <Button className="w-full font-bold h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
                                    Edit
                                  </Button>
                                </Link>
                              </div>
                              <Link href={`/admin/study`} className="w-full block">
                                <Button variant="outline" className="w-full font-bold h-10 rounded-xl border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center">
                                  Manage / Delete in Admin
                                </Button>
                              </Link>
                            </div>
                          ) : purchased ? (
                            <a
                              href={doc.file_url === "pending" ? `/view/${doc.id}` : doc.file_url}
                              target={doc.file_url === "pending" ? "_self" : "_blank"}
                              rel="noreferrer"
                              className="w-full block"
                            >
                              <Button className="w-full font-bold h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2">
                                <ExternalLink className="w-4 h-4" /> Open Full Document
                              </Button>
                            </a>
                          ) : inCart ? (
                            <Link href="/cart" className="w-full block">
                              <Button variant="outline" className="w-full font-bold h-12 rounded-xl border-indigo-500 text-indigo-600 hover:bg-indigo-50">
                                <ShoppingCart className="w-4 h-4 mr-2" /> Go to Cart & Unlock
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              onClick={() => handleAddToCart(doc)}
                              className="w-full font-bold h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                            >
                              <ShoppingCart className="w-4 h-4" /> Unlock Document — ₹{doc.price}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: AI CAREER GUIDANCE GENERATOR */}
        {activeTab === "ai-roadmap" && (
          <section className="animate-in fade-in duration-300">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-10 border shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-bold mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> Interactive AI Tool
                  </div>
                  <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <Map className="w-8 h-8 text-indigo-600" />
                    AI Career Roadmap Generator
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Type your dream role and current background to get an instant month-by-month learning roadmap powered by Groq AI.
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-[360px_1fr] gap-8">
                {/* Form Side */}
                <div className="space-y-5">
                  <form onSubmit={handleGenerateRoadmap} className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-2xl border space-y-5">
                    <div>
                      <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-500" /> Dream Role *
                      </label>
                      <input
                        required
                        placeholder="e.g. Java Full Stack Engineer / Deloitte SDE"
                        value={goal}
                        onChange={e => setGoal(e.target.value)}
                        className="w-full p-3.5 rounded-xl border bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-500" /> Your Background <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. 2026 CS graduate, know basic Java & React"
                        value={background}
                        onChange={e => setBackground(e.target.value)}
                        className="w-full p-3.5 rounded-xl border bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Preferred AI Engine</label>
                      <ModelSelector value={preferredModel} onChange={setPreferredModel} />
                    </div>
                    <Button type="submit" disabled={isLoadingRoadmap} className="w-full h-13 font-bold text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md">
                      {isLoadingRoadmap ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Sparkles className="mr-2 h-5 w-5" />}
                      {isLoadingRoadmap ? "Generating Roadmap..." : "Generate AI Roadmap"}
                    </Button>
                  </form>

                  {roadmap && (
                    <div className="bg-purple-50 dark:bg-purple-950/30 p-5 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-3">
                      <p className="font-bold text-sm flex items-center gap-2 text-purple-900 dark:text-purple-200">
                        <Layers className="w-4 h-4 text-purple-600" /> Export Options
                      </p>
                      <Button onClick={handleDownloadPDF} variant="outline" className="w-full justify-start gap-2 bg-white dark:bg-zinc-900 font-bold">
                        <Download className="w-4 h-4 text-red-500" /> Download PDF Roadmap
                      </Button>
                      <Button onClick={() => {
                        navigator.clipboard.writeText(roadmap);
                        alert("Roadmap copied to clipboard!");
                      }} variant="outline" className="w-full justify-start gap-2 bg-white dark:bg-zinc-900 font-bold">
                        <Copy className="w-4 h-4 text-blue-500" /> Copy Text
                      </Button>
                    </div>
                  )}
                </div>

                {/* Output Display Side */}
                <div className="bg-gray-50 dark:bg-zinc-800/30 rounded-2xl border min-h-[450px] flex flex-col overflow-hidden">
                  {!roadmap && !isLoadingRoadmap && (
                    <div className="my-auto flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                      <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl flex items-center justify-center mb-4">
                        <Map className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1">Your Interactive Career Guide</h3>
                      <p className="text-sm max-w-md">
                        Fill in your dream role on the left (e.g. &quot;Deloitte Fresher SDE&quot;) and click Generate to see your month-by-month visual timeline.
                      </p>
                    </div>
                  )}

                  {isLoadingRoadmap && (
                    <div className="my-auto flex flex-col items-center justify-center text-center p-8 text-indigo-600">
                      <Cpu className="w-16 h-16 animate-pulse mb-4" />
                      <h3 className="text-xl font-bold animate-pulse text-foreground">Creating custom career roadmap...</h3>
                      <p className="text-sm text-muted-foreground mt-2">Groq AI is processing your request</p>
                    </div>
                  )}

                  {roadmap && !isLoadingRoadmap && (
                    <div className="flex-1 flex flex-col">
                      <div className="flex border-b bg-white dark:bg-zinc-900">
                        <button
                          onClick={() => setActiveView("text")}
                          className={`flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeView === "text" ? "border-indigo-600 text-indigo-600 bg-indigo-50/50" : "border-transparent text-muted-foreground hover:bg-muted/50"}`}
                        >
                          <FileText className="w-4 h-4" /> Detailed Text
                        </button>
                        <button
                          onClick={() => setActiveView("visual")}
                          className={`flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeView === "visual" ? "border-indigo-600 text-indigo-600 bg-indigo-50/50" : "border-transparent text-muted-foreground hover:bg-muted/50"}`}
                        >
                          <BarChart3 className="w-4 h-4" /> Visual Timeline ({phases.length} Phases)
                        </button>
                      </div>

                      <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[650px] bg-white dark:bg-zinc-900">
                        {activeView === "text" ? (
                          <div ref={roadmapRef} className="prose dark:prose-invert max-w-none text-left">
                            <ReactMarkdown>{roadmap}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {phases.map((phase, i) => (
                              <div key={i} className="p-5 rounded-2xl border bg-slate-50 dark:bg-zinc-800/50 space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${phaseColors[i % phaseColors.length]} text-white font-bold flex items-center justify-center text-sm shadow`}>
                                    {i + 1}
                                  </div>
                                  <h4 className="font-bold text-lg text-indigo-900 dark:text-indigo-200">{phase.title}</h4>
                                </div>
                                {phase.description && <p className="text-sm text-muted-foreground pl-11">{phase.description}</p>}
                                {phase.items.length > 0 && (
                                  <ul className="pl-11 space-y-1.5">
                                    {phase.items.map((item, j) => (
                                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
