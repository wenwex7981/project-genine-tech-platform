"use client";

import { useState, useEffect } from "react";
import { Mic, MicOff, Send, Loader2, PlayCircle, StopCircle, ArrowLeft, CheckCircle2, AlertTriangle, ArrowRight, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ModelSelector, AIModel } from "@/components/ModelSelector";
import { AnimatedAvatar } from "@/components/AnimatedAvatar";
import { Avatar3D } from "@/components/Avatar3D";

type Message = {
  role: "interviewer" | "candidate";
  content: string;
};

type EvaluationReport = {
  overallScore: number;
  metrics: {
    communication: number;
    technicalKnowledge: number;
    jdRelevance: number;
    answerStructure: number;
    confidence: number;
  };
  strongAreas: string[];
  needsImprovement: string[];
  recommendedPractice: string[];
};

export default function MockInterviewPage() {
  const [uiState, setUiState] = useState<"setup" | "interview" | "report">("setup");
  
  // Setup State
  const [role, setRole] = useState("Software Engineer");
  const [company, setCompany] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [round, setRound] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Medium");
  const [jd, setJd] = useState("");
  const [resume, setResume] = useState("");
  const [preferredModel, setPreferredModel] = useState<AIModel>("deepseek");
  const [avatarVariant, setAvatarVariant] = useState<"robot" | "minion" | "human">("robot");
  
  // Voice State
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");

  // Interview State
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAIQuestion, setCurrentAIQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Report State
  const [report, setReport] = useState<EvaluationReport | null>(null);

  useEffect(() => {
    // Load voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoiceURI) {
        // Default to a Google US English voice if available, else first English voice
        const defaultVoice = availableVoices.find(v => v.lang === "en-US" && v.name.includes("Google")) || availableVoices.find(v => v.lang.startsWith("en"));
        if (defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
      }
    };
    
    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Initialize Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";
        
        rec.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const transcript = event.results[i][0].transcript;
              setTextInput(prev => prev + (prev ? " " : "") + transcript);
            }
          }
        };
        
        rec.onend = () => {
          setIsRecording(false);
        };
        
        rec.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };
        
        setRecognition(rec);
      }
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Fetch live voices directly from the browser rather than relying on state
    // This fixes the bug on Windows where the selected voice might not be applied correctly
    const liveVoices = window.speechSynthesis.getVoices();
    if (selectedVoiceURI) {
      const selectedVoice = liveVoices.find(v => v.voiceURI === selectedVoiceURI);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert("Voice recognition is not supported in this browser. Please use the text input.");
      return;
    }
    
    if (isRecording) {
      recognition.stop();
    } else {
      stopSpeaking();
      recognition.start();
      setIsRecording(true);
    }
  };

  const startInterview = async () => {
    setUiState("interview");
    setIsLoading(true);
    try {
      const payload = { history: [], role, company, experienceLevel, round, difficulty, jd, resume, preferredModel };
      const response = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      const newMsg: Message = { role: "interviewer", content: data.text };
      setMessages([newMsg]);
      setCurrentAIQuestion(data.text);
      speakText(data.text);
    } catch (err: any) {
      alert("Error starting interview: " + err.message);
      setUiState("setup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!textInput.trim()) return;
    stopSpeaking();
    
    const userMsg = textInput.trim();
    setTextInput("");
    
    const updatedMessages: Message[] = [...messages, { role: "candidate", content: userMsg }];
    setMessages(updatedMessages);
    setCurrentAIQuestion(""); // Clear question while loading
    setIsLoading(true);
    
    try {
      const payload = { history: updatedMessages, role, company, experienceLevel, round, difficulty, jd, resume, preferredModel };
      const response = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      const aiResponseText = data.text;
      setMessages(prev => [...prev, { role: "interviewer", content: aiResponseText }]);
      setCurrentAIQuestion(aiResponseText);
      speakText(aiResponseText);
    } catch (err: any) {
      alert("Error generating response: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const endInterview = async () => {
    stopSpeaking();
    if (messages.length < 2) {
      alert("Not enough interview data to evaluate. Please answer at least one question.");
      setUiState("setup");
      return;
    }
    
    setIsLoading(true);
    setUiState("report");
    
    try {
      const payload = { history: messages, role, company, experienceLevel, round, difficulty, jd, resume, preferredModel };
      const response = await fetch('/api/mock-interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setReport(data);
    } catch (err: any) {
      alert("Error generating report: " + err.message);
      setUiState("setup");
    } finally {
      setIsLoading(false);
    }
  };

  // --- UI Renders ---

  if (uiState === "setup") {
    return (
      <div className="min-h-screen bg-muted/20 text-slate-900 pb-20">
        <div className="bg-purple-700 pt-8 pb-32">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link href="/study" className="text-purple-200 hover:text-white flex items-center gap-2 text-sm font-bold mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Study Hub
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Mock Interview Setup</h1>
            <p className="text-purple-200 text-lg">Configure your AI interviewer for a highly realistic, tailored experience.</p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl -mt-20">
          <div className="bg-white border rounded-3xl shadow-xl p-6 md:p-10 space-y-8">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Target Position</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Job Role</label>
                  <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. Frontend Engineer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Company (Optional)</label>
                    <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. Google" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Experience Level</label>
                    <input type="text" value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500" placeholder="e.g. Fresher, 1 Year" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Round</label>
                    <select value={round} onChange={e => setRound(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500">
                      <option>HR</option>
                      <option>Technical</option>
                      <option>System Design</option>
                      <option>Behavioral</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Difficulty</label>
                    <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Basic</option>
                      <option>Medium</option>
                      <option>Hard</option>
                      <option>Very Hard</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-slate-800 border-b pb-2">AI Settings</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Voice Selection</label>
                  <select value={selectedVoiceURI} onChange={e => setSelectedVoiceURI(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500">
                    {voices.map(v => (
                      <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Avatar Graphic</label>
                  <select value={avatarVariant} onChange={e => setAvatarVariant(e.target.value as any)} className="w-full bg-slate-50 border rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="robot">High-Tech Robot</option>
                    <option value="minion">Minion</option>
                    <option value="human">Human</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">AI Engine</label>
                  <ModelSelector value={preferredModel} onChange={setPreferredModel} />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Context (Highly Recommended)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Job Description</label>
                  <textarea value={jd} onChange={e => setJd(e.target.value)} rows={4} className="w-full bg-slate-50 border rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500 text-sm" placeholder="Paste JD here to tailor questions..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Your Resume Content</label>
                  <textarea value={resume} onChange={e => setResume(e.target.value)} rows={4} className="w-full bg-slate-50 border rounded-xl p-3 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500 text-sm" placeholder="Paste your resume text so the AI can ask about your experience..." />
                </div>
              </div>
            </div>

            <Button onClick={startInterview} disabled={isLoading} className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-black text-lg rounded-xl shadow-xl shadow-purple-200">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Start Mock Interview"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (uiState === "interview") {
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-900">
        
        {/* Animated Graphic Avatar Background - Unblurred per request */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-60 md:opacity-80 pointer-events-none">
          {avatarVariant === 'minion' ? (
            <Avatar3D isSpeaking={isSpeaking} modelUrl="/models/Minion.glb" />
          ) : (
            <AnimatedAvatar isSpeaking={isSpeaking} variant={avatarVariant} className="w-[120%] h-[120%] max-w-none max-h-none opacity-100" />
          )}
        </div>
        
        {/* We also put a clear animated avatar on top of the card so it feels like a real character */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-0 hidden md:block">
          {avatarVariant === 'minion' ? null : (
            <AnimatedAvatar isSpeaking={isSpeaking} variant={avatarVariant} className="w-64 h-64 opacity-100 drop-shadow-2xl" />
          )}
        </div>

        <div className="w-full max-w-4xl flex flex-col h-[90vh] max-h-[900px] z-10 mt-20 md:mt-0 relative">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 mt-10 md:mt-0">
            <div>
              <h2 className="text-xl font-black text-white">{role} Interview</h2>
              <p className="text-sm font-medium text-purple-200">{company ? `${company} • ` : ''}{round} Round • {difficulty}</p>
            </div>
            <div className="flex gap-3">
              {isSpeaking && (
                <button onClick={stopSpeaking} className="px-4 py-2 bg-rose-500/80 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-rose-500 transition backdrop-blur-md">
                  <StopCircle className="w-4 h-4" /> Stop Audio
                </button>
              )}
              <button onClick={endInterview} className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm font-bold hover:bg-white/30 transition backdrop-blur-md border border-white/20">
                End & Evaluate
              </button>
            </div>
          </div>

          {/* Floating Question Card (Glassmorphism & Scrollable) */}
          <div className="flex-1 flex flex-col items-center justify-center w-full relative min-h-0">
            <div className={`w-full max-w-3xl max-h-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 p-6 md:p-10 transition-all duration-500 text-center flex flex-col items-center overflow-hidden ${isLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
              
              {/* Speaking Indicator Badge (Moved to card top) */}
              {isSpeaking && (
                <div className="absolute top-0 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full border border-white/20 shadow-md flex items-center gap-2 z-20">
                  <span>AI IS SPEAKING</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="flex flex-col gap-4 w-full items-center">
                  <div className="h-6 bg-white/20 rounded-md w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-white/20 rounded-md w-full animate-pulse"></div>
                  <div className="h-6 bg-white/20 rounded-md w-5/6 animate-pulse"></div>
                </div>
              ) : (
                <div className="overflow-y-auto w-full max-h-full px-2 custom-scrollbar">
                  <h3 className="text-xl md:text-3xl font-bold text-white leading-snug drop-shadow-md py-4">
                    {currentAIQuestion}
                  </h3>
                </div>
              )}
            </div>
          </div>

          {/* Input Area (Glassmorphism) */}
          <div className="mt-8 bg-black/40 backdrop-blur-xl p-2 rounded-2xl shadow-xl border border-white/20 flex flex-col md:flex-row gap-2 items-stretch max-w-3xl w-full mx-auto">
            <button 
              onClick={toggleRecording}
              className={`md:w-32 flex flex-col items-center justify-center p-3 rounded-xl transition-all ${isRecording ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              {isRecording ? <MicOff className="w-6 h-6 mb-1" /> : <Mic className="w-6 h-6 mb-1" />}
              <span className="text-xs font-bold text-center leading-tight">{isRecording ? "Stop\nListening" : "Tap to\nSpeak"}</span>
            </button>
            
            <textarea 
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Or type your answer here..."
              className="flex-1 p-4 bg-white/10 text-white placeholder-white/50 border border-white/10 rounded-xl resize-none outline-none focus:ring-2 focus:ring-purple-400 min-h-[80px]"
            />
            
            <button 
              onClick={handleSendMessage}
              disabled={!textInput.trim() || isLoading}
              className="md:w-20 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 flex items-center justify-center rounded-xl text-white transition-all shadow-md"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  // uiState === "report"
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <div className="bg-slate-900 pt-8 pb-32">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/study" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold mb-8">
            <ArrowLeft className="w-4 h-4" /> Exit Report
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white"><BarChart className="w-6 h-6"/></div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">AI Mock Interview Report</h1>
          </div>
          <p className="text-slate-400 text-lg">Detailed evaluation for your {role} mock interview.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-20">
        {!report ? (
          <div className="bg-white border rounded-3xl shadow-xl p-20 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-6" />
            <h3 className="text-2xl font-black text-slate-800 mb-2">Analyzing your interview...</h3>
            <p className="text-slate-500 max-w-md">Our AI is evaluating your communication, technical accuracy, and answer structure to generate a highly detailed scorecard.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="col-span-1 bg-white rounded-3xl shadow-lg border p-8 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Overall Score</p>
                <div className="relative w-40 h-40 rounded-full flex items-center justify-center border-8 border-purple-100 mb-4 shadow-inner">
                  <div className="absolute inset-0 border-8 border-purple-600 rounded-full border-t-transparent border-r-transparent rotate-45"></div>
                  <span className="text-5xl font-black text-slate-800">{report.overallScore}</span>
                  <span className="absolute bottom-6 text-sm font-bold text-slate-400">/ 100</span>
                </div>
                <p className="font-bold text-slate-700">
                  {report.overallScore >= 80 ? 'Excellent Performance! 🎉' : report.overallScore >= 65 ? 'Good Effort, Needs Polish 👍' : 'Needs Significant Practice 📚'}
                </p>
              </div>

              <div className="col-span-2 bg-white rounded-3xl shadow-lg border p-8">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Detailed Metrics</p>
                <div className="space-y-5">
                  {Object.entries(report.metrics).map(([key, val]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm font-bold text-slate-700 mb-1">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span>{val}/100</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${val >= 80 ? 'bg-emerald-500' : val >= 65 ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ width: `${val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Analysis Boxes */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8">
                <p className="text-sm font-bold text-emerald-800 uppercase tracking-widest mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Strong Areas</p>
                <ul className="space-y-3">
                  {report.strongAreas.map((item, i) => (
                    <li key={i} className="flex gap-3 text-emerald-900 font-medium">
                      <span className="text-emerald-500 font-black">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8">
                <p className="text-sm font-bold text-rose-800 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/> Needs Improvement</p>
                <ul className="space-y-3">
                  {report.needsImprovement.map((item, i) => (
                    <li key={i} className="flex gap-3 text-rose-900 font-medium">
                      <span className="text-rose-500 font-black">⚠</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-3xl shadow-lg border p-8">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Recommended Practice Topics</p>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {report.recommendedPractice.map((topic, i) => (
                  <div key={i} className="bg-slate-50 border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-black flex items-center justify-center mb-3">{i+1}</div>
                    <span className="font-bold text-slate-800">{topic}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button onClick={() => setUiState("setup")} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 h-12 rounded-xl">
                  Start Another Interview
                </Button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
