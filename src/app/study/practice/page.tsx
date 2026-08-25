"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Play, ArrowLeft, TerminalSquare, Loader2, Sparkles, Send, CheckCircle } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

function PracticeArena() {
  const searchParams = useSearchParams();
  const topic = searchParams.get("topic") || "Basic Python";
  
  const [code, setCode] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const [history, setHistory] = useState<{ role: string, content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [mode, setMode] = useState<"learning" | "quiz">("learning");

  // Initialize the first task
  useEffect(() => {
    fetchNextTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNextTask = async (submittedCode?: string, isFixRequest: boolean = false) => {
    setIsLoading(true);
    setTerminalOutput(""); // Clear previous terminal while loading
    try {
      const response = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          code: submittedCode || "",
          history,
          isFixRequest,
          mode
        }),
      });
      
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      // Add to history
      let newHistory = [...history];
      
      // If code was submitted, append the user's action to history
      if (submittedCode) {
        newHistory.push({ role: "user", content: isFixRequest ? `Asked for AI Help with code:\n\`\`\`\n${submittedCode}\n\`\`\`` : `Submitted code:\n\`\`\`\n${submittedCode}\n\`\`\`` });
      }
      
      // Append AI's story to history
      if (data.story) {
        newHistory.push({ role: "assistant", content: data.story });
      }
      
      setHistory(newHistory);
      
      if (data.terminal) {
        setTerminalOutput(data.terminal);
      }
      
      if (data.completed && !isFixRequest) {
        setIsCompleted(true);
        setTasksCompleted(prev => prev + 1);
        setTimeout(() => setIsCompleted(false), 3000);
      }

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunCode = () => {
    if (!code.trim()) {
      setTerminalOutput("Error: No code to execute.");
      return;
    }
    fetchNextTask(code, false);
  };

  const handleFixWithAI = () => {
    if (!code.trim()) {
      setTerminalOutput("Error: No code to fix.");
      return;
    }
    fetchNextTask(code, true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      
      {/* Navbar */}
      <header className="h-16 border-b border-white/10 bg-slate-900 flex items-center px-6 justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/study" className="text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h1 className="font-bold text-white text-lg">{topic} Arena</h1>
            <span className="ml-4 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-xs font-bold uppercase tracking-widest">
              Task {tasksCompleted + 1}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
           <div className="flex bg-slate-950 rounded-lg p-1 mr-4 border border-white/10">
             <button
               onClick={() => { setMode("learning"); setHistory([]); setTerminalOutput(""); fetchNextTask("", false); }}
               className={`px-3 py-1 text-xs font-bold rounded-md transition ${mode === "learning" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
             >
               Learning Mode
             </button>
             <button
               onClick={() => { setMode("quiz"); setHistory([]); setTerminalOutput(""); fetchNextTask("", false); }}
               className={`px-3 py-1 text-xs font-bold rounded-md transition ${mode === "quiz" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"}`}
             >
               Quiz Mode
             </button>
           </div>
           <button 
             onClick={handleRunCode}
             disabled={isLoading}
             className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-md font-bold text-sm flex items-center gap-2 transition"
           >
             {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
             Run & Evaluate
           </button>
        </div>
      </header>

      {/* Main Split Screen */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Pane: Story/Task UI */}
        <div className="w-full md:w-1/2 lg:w-5/12 border-r border-white/10 bg-slate-900 flex flex-col">
          <div className="p-4 border-b border-white/5 bg-slate-800/50">
            <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">AI Tutor Guide</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {history.length === 0 && isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p>Generating your adventure...</p>
              </div>
            )}
            
            {history.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">AI Tutor</span>
                    </div>
                  )}
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && history.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-200 rounded-2xl rounded-tl-sm border border-slate-700 p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Code & Terminal */}
        <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col bg-slate-950">
          
          {/* Code Editor Area */}
          <div className="flex-1 flex flex-col relative">
            <div className="h-10 bg-slate-900 border-b border-white/5 flex items-center px-4">
              <span className="text-xs font-mono text-slate-400">solution.code</span>
            </div>
            
            {isCompleted && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-xl flex items-center gap-2 animate-bounce">
                <CheckCircle className="w-5 h-5" />
                Challenge Passed!
              </div>
            )}

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Type your code here..."
              className="flex-1 w-full bg-slate-950 text-slate-300 font-mono text-sm p-6 resize-none focus:outline-none custom-scrollbar leading-relaxed"
              spellCheck="false"
            />
          </div>

          {/* Terminal Area */}
          <div className="h-64 border-t border-white/10 bg-black flex flex-col flex-shrink-0">
            <div className="h-10 bg-slate-900 border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <TerminalSquare className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-mono text-slate-400">Terminal Output</span>
              </div>
              <button 
                onClick={handleFixWithAI}
                disabled={isLoading || !code.trim()}
                className="text-xs font-bold bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/40 px-2 py-1 rounded transition flex items-center gap-1 disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3" /> Fix with AI
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto custom-scrollbar text-green-400 bg-black">
              {isLoading ? (
                <span className="text-slate-500 animate-pulse">Running simulation...</span>
              ) : terminalOutput ? (
                <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
              ) : (
                <span className="text-slate-600">No output yet. Click 'Run & Evaluate' to execute.</span>
              )}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
}

export default function PracticeArenaPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>}>
      <PracticeArena />
    </Suspense>
  );
}
