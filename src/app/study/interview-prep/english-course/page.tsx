"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Loader2, ArrowLeft, Volume2, StopCircle, ChevronRight, BookOpen, CheckCircle, Star, Trophy, RefreshCw, Play, Zap, Target, GraduationCap, MessageSquare } from "lucide-react";
import Link from "next/link";
import { ModelSelector, AIModel } from "@/components/ModelSelector";
import { AudioMeter } from "@/components/AudioMeter";

// ─── COURSE CURRICULUM ────────────────────────────────────────────────────────
const CURRICULUM = [
  {
    id: "tenses",
    icon: "📅",
    title: "English Tenses",
    color: "from-blue-600 to-indigo-600",
    borderColor: "border-blue-500/40",
    bgColor: "bg-blue-950/30",
    lessons: [
      { id: "present_simple", title: "Present Simple", desc: "I eat, She works, They play" },
      { id: "present_continuous", title: "Present Continuous", desc: "I am eating, She is working" },
      { id: "present_perfect", title: "Present Perfect", desc: "I have done, She has finished" },
      { id: "present_perfect_cont", title: "Present Perfect Continuous", desc: "I have been working" },
      { id: "past_simple", title: "Past Simple", desc: "I ate, She worked, They played" },
      { id: "past_continuous", title: "Past Continuous", desc: "I was eating, She was working" },
      { id: "past_perfect", title: "Past Perfect", desc: "I had done, She had finished" },
      { id: "future_simple", title: "Future Simple (Will)", desc: "I will eat, She will work" },
      { id: "future_going_to", title: "Future (Going To)", desc: "I am going to study, She is going to join" },
      { id: "future_perfect", title: "Future Perfect", desc: "I will have finished, She will have joined" },
    ],
  },
  {
    id: "vocabulary",
    icon: "📖",
    title: "Vocabulary Builder",
    color: "from-emerald-600 to-teal-600",
    borderColor: "border-emerald-500/40",
    bgColor: "bg-emerald-950/30",
    lessons: [
      { id: "word_families", title: "Word Families", desc: "act → action → active → actively" },
      { id: "synonyms", title: "Synonyms & Antonyms", desc: "happy ↔ sad, big ↔ small" },
      { id: "collocations", title: "Collocations", desc: "make a decision, do homework, take a break" },
      { id: "phrasal_verbs", title: "Phrasal Verbs", desc: "give up, look into, bring up, carry on" },
      { id: "idioms", title: "Common Idioms", desc: "break a leg, bite the bullet, hit the nail" },
      { id: "formal_informal", title: "Formal vs Informal Words", desc: "commence vs start, obtain vs get" },
      { id: "daily_words", title: "Daily English Vocabulary", desc: "Words for work, college, life" },
    ],
  },
  {
    id: "sentence_structure",
    icon: "🏗️",
    title: "Sentence Structure",
    color: "from-purple-600 to-pink-600",
    borderColor: "border-purple-500/40",
    bgColor: "bg-purple-950/30",
    lessons: [
      { id: "basic_sentences", title: "Basic Sentence Types", desc: "Simple, compound, complex sentences" },
      { id: "questions", title: "Forming Questions", desc: "Yes/No, Wh- questions, tag questions" },
      { id: "negatives", title: "Negatives", desc: "I don't, She isn't, They haven't" },
      { id: "conditionals", title: "Conditionals (If-clauses)", desc: "If I study, I will pass" },
      { id: "passive_voice", title: "Passive Voice", desc: "The project was done by me" },
      { id: "reported_speech", title: "Reported Speech", desc: "He said that he was busy" },
    ],
  },
  {
    id: "indian_mistakes",
    icon: "🇮🇳",
    title: "Common Indian English Mistakes",
    color: "from-amber-600 to-orange-600",
    borderColor: "border-amber-500/40",
    bgColor: "bg-amber-950/30",
    lessons: [
      { id: "itself_only", title: '"Itself" and "Only" Overuse', desc: 'I will do it only → I will do it' },
      { id: "double_comparatives", title: "Double Comparatives", desc: 'More better → Better' },
      { id: "wrong_prepositions", title: "Wrong Prepositions", desc: "Discuss about → Discuss, revert back → revert" },
      { id: "articles", title: "Articles: A, An, The", desc: "I went to hospital → I went to THE hospital" },
      { id: "subject_verb_agreement", title: "Subject-Verb Agreement", desc: "She don't → She doesn't" },
      { id: "confused_words", title: "Commonly Confused Words", desc: "affect/effect, then/than, its/it's" },
      { id: "hinglish_habits", title: "Hinglish Habits to Break", desc: "Everyday phrases that sound unprofessional" },
    ],
  },
  {
    id: "fluency",
    icon: "🎤",
    title: "Fluency & Speaking",
    color: "from-rose-600 to-pink-600",
    borderColor: "border-rose-500/40",
    bgColor: "bg-rose-950/30",
    lessons: [
      { id: "filler_words", title: "Replacing Filler Words", desc: 'Replace "um, uh, basically" with pauses' },
      { id: "linking_words", title: "Linking Words & Connectors", desc: "However, Moreover, In addition, Therefore" },
      { id: "opinion_phrases", title: "Opinion Phrases", desc: "In my opinion, I believe, From my perspective" },
      { id: "self_intro_phrases", title: "Self-Intro Power Phrases", desc: "Strong opening and closing lines" },
      { id: "pronunciation_tips", title: "Pronunciation Tips", desc: "Word stress, silent letters, tricky sounds" },
      { id: "confident_speaking", title: "Speaking with Confidence", desc: "Pace, pauses, eye contact" },
    ],
  },
];

type ChatMessage = {
  role: "user" | "alex";
  content: string;
  practiceTask?: string;
  isCorrection?: boolean;
  correctedSentence?: string;
};

type VoiceOption = {
  voice: SpeechSynthesisVoice;
  label: string;
  region: "India" | "UK" | "US" | "Other";
  gender: "Female" | "Male" | "Unknown";
};

// Module-level pure function — no stale closure risk
function classifyVoice(v: SpeechSynthesisVoice): VoiceOption {
  const lang = v.lang.toLowerCase();
  const name = v.name.toLowerCase();
  let region: VoiceOption["region"] = "Other";
  if (lang.includes("-in") || name.includes("india") || name.includes("heera") || name.includes("ravi") || name.includes("kalpana")) region = "India";
  else if (lang.includes("-gb") || lang.includes("-uk") || name.includes("hazel") || name.includes("george") || name.includes("ryan")) region = "UK";
  else if (lang.startsWith("en-us") || name.includes("zira") || name.includes("david") || name.includes("mark") || name.includes("jenny") || name.includes("aria") || lang === "en") region = "US";
  const femaleKeys = ["female","woman","zira","heera","kalpana","hazel","susan","jenny","aria","sonia","libby","maisie","clara","natasha","samantha","victoria"];
  const maleKeys = ["male","man","david","ravi","george","mark","ryan","thomas","reed","guy"];
  let gender: VoiceOption["gender"] = "Unknown";
  if (femaleKeys.some(k => name.includes(k))) gender = "Female";
  else if (maleKeys.some(k => name.includes(k))) gender = "Male";
  return { voice: v, label: v.name.replace("Microsoft ","").replace(" Online (Natural)","").replace("Google ",""), region, gender };
}

export default function EnglishCoursePage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<{ id: string; title: string; moduleTitle: string } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [preferredModel, setPreferredModel] = useState<AIModel>("groq");
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSetVoiceRef = useRef(false); // prevent stale-closure re-render loop

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      const english = all.filter(v => v.lang.startsWith("en") || v.lang === "en");
      const classified = english.map(classifyVoice);
      setAvailableVoices(classified);
      // Only auto-select once — use ref to avoid stale closure re-render loop
      if (!hasSetVoiceRef.current && classified.length > 0) {
        const preferred = classified.find(v => v.region === "India") || classified.find(v => v.region === "US") || classified[0];
        if (preferred) {
          setSelectedVoice(preferred.voice);
          hasSetVoiceRef.current = true;
        }
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = "en-IN";
        rec.onresult = (e: any) => {
          for (let i = e.resultIndex; i < e.results.length; ++i) {
            if (e.results[i].isFinal) setTextInput(prev => prev + (prev ? " " : "") + e.results[i][0].transcript);
          }
        };
        rec.onend = () => setIsRecording(false);
        rec.onerror = () => setIsRecording(false);
        setRecognition(rec);
      }
    }
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  // Lock body scroll during lesson
  useEffect(() => {
    if (selectedLesson) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [selectedLesson]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    if (!recognition) { alert("Voice not supported. Please type."); return; }
    if (isRecording) recognition.stop();
    else { window.speechSynthesis.cancel(); recognition.start(); setIsRecording(true); }
  };

  const startLesson = async (mod: typeof CURRICULUM[0], lesson: typeof CURRICULUM[0]["lessons"][0]) => {
    setSelectedLesson({ id: lesson.id, title: lesson.title, moduleTitle: mod.title });
    setMessages([]);
    setIsLoading(true);
    try {
      const res = await fetch("/api/english-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: [], module: mod.title, lesson: lesson.title, preferredModel }),
      });
      const data = await res.json();
      const alexMsg: ChatMessage = {
        role: "alex",
        content: data.alexReply || "Let's start the lesson!",
        practiceTask: data.practiceTask || "",
      };
      setMessages([alexMsg]);
      speakText(alexMsg.content + (alexMsg.practiceTask ? " " + alexMsg.practiceTask : ""));
    } catch {
      const fallback: ChatMessage = { role: "alex", content: "Hey! Let's start learning. I'm Alex your English trainer. Ready? 🎓" };
      setMessages([fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    const userMsg = textInput.trim();
    if (!userMsg || isLoading || !selectedLesson) return;
    setTextInput("");
    window.speechSynthesis.cancel();
    if (isRecording && recognition) { recognition.stop(); setIsRecording(false); }

    const newUserMsg: ChatMessage = { role: "user", content: userMsg };
    const updated = [...messages, newUserMsg];
    setMessages(updated);
    setIsLoading(true);

    const mod = CURRICULUM.find(m => m.lessons.some(l => l.id === selectedLesson.id));

    try {
      const history = updated.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/english-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: history.slice(0, -1), userMessage: userMsg, module: mod?.title, lesson: selectedLesson.title, preferredModel, mode: "practice" }),
      });
      const data = await res.json();

      const alexMsg: ChatMessage = {
        role: "alex",
        content: data.alexReply || "Great try!",
        practiceTask: data.practiceTask || "",
        isCorrection: data.isCorrection || false,
        correctedSentence: data.correctedSentence || "",
      };
      setMessages(prev => [...prev, alexMsg]);
      speakText(alexMsg.content);

      if (data.lessonComplete) {
        setCompletedLessons(prev => new Set([...prev, selectedLesson.id]));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentMod = selectedLesson ? CURRICULUM.find(m => m.lessons.some(l => l.id === selectedLesson.id)) : null;

  const regionGroups: VoiceOption["region"][] = ["India", "US", "UK", "Other"];
  const regionFlags: Record<string, string> = { India: "🇮🇳", US: "🇺🇸", UK: "🇬🇧", Other: "🌐" };
  const genderIcons: Record<string, string> = { Female: "♀", Male: "♂", Unknown: "" };

  // ─── LESSON VIEW ─────────────────────────────────────────────────────────────
  if (selectedLesson && currentMod) {
    return (
      <div style={{ position: 'fixed', inset: 0, top: '64px', background: '#0f172a', display: 'flex', flexDirection: 'column', zIndex: 40 }}>
        {/* Header */}
        <div className="bg-slate-900/95 border-b border-white/10 px-4 py-3 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => { setSelectedLesson(null); window.speechSynthesis.cancel(); }}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${currentMod.color}`}>{currentMod.icon}</div>
            <div>
              <p className="font-black text-white text-sm">{selectedLesson.title}</p>
              <p className="text-xs text-slate-400">{currentMod.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Voice picker */}
            <div className="relative">
              <button onClick={() => setShowVoicePicker(!showVoicePicker)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-700 transition flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                {selectedVoice ? selectedVoice.name.replace("Microsoft ", "").replace(" Online (Natural)", "").replace("Google ", "").slice(0, 18) : "Pick Voice"}
              </button>
              {showVoicePicker && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-700">
                    <p className="text-xs font-black text-white">🎙️ Select Voice for Alex</p>
                  </div>
                  <div className="overflow-y-auto max-h-72">
                    {regionGroups.map(region => {
                      const voices = availableVoices.filter(v => v.region === region);
                      if (voices.length === 0) return null;
                      return (
                        <div key={region}>
                          <div className="px-3 py-1.5 bg-slate-800/60 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {regionFlags[region]} {region} English
                          </div>
                          {voices.map((v, i) => (
                            <button key={i} onClick={() => { setSelectedVoice(v.voice); setShowVoicePicker(false); }}
                              className={`w-full px-3 py-2.5 text-left flex justify-between items-center hover:bg-slate-800 transition ${selectedVoice?.name === v.voice.name ? "bg-emerald-900/30 border-l-2 border-emerald-400" : ""}`}>
                              <span className="text-sm text-white font-medium">{v.label}</span>
                              <div className="flex items-center gap-2">
                                {v.gender !== "Unknown" && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${v.gender === "Female" ? "bg-pink-900/60 text-pink-300" : "bg-blue-900/60 text-blue-300"}`}>
                                    {genderIcons[v.gender]} {v.gender}
                                  </span>
                                )}
                                {selectedVoice?.name === v.voice.name && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      );
                    })}
                    {availableVoices.length === 0 && (
                      <p className="p-4 text-xs text-slate-400 text-center">No English voices found. Try Chrome or Edge browser.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {isSpeaking && (
              <button onClick={() => { window.speechSynthesis.cancel(); setIsSpeaking(false); }}
                className="px-3 py-2 bg-rose-600/80 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                <StopCircle className="w-4 h-4" /> Stop
              </button>
            )}
            <button onClick={() => { setMessages([]); startLesson(currentMod, currentMod.lessons.find(l => l.id === selectedLesson.id)!); }}
              className="px-3 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-slate-700">
              <RefreshCw className="w-4 h-4" /> Restart
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Alex Robot Banner */}
          <div className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-white/5 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base bg-gradient-to-br ${currentMod.color}`}>🤖</div>
            <div className="flex-1">
              <p className="text-xs font-bold text-white">Alex is teaching: <span className="text-emerald-400">{selectedLesson.title}</span></p>
              <p className="text-[10px] text-slate-400">Type your practice sentence or speak — Alex will correct you instantly</p>
            </div>
            {completedLessons.has(selectedLesson.id) && (
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                <Trophy className="w-4 h-4" /> Completed!
              </div>
            )}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', minHeight: 0 }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3 items-start`}>
                {msg.role === "alex" && (
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-gradient-to-br ${currentMod.color} flex-shrink-0 mt-1`}>
                    {currentMod.icon}
                  </div>
                )}
                <div className="max-w-[80%] space-y-2">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>
                  {/* Practice Task */}
                  {msg.role === "alex" && msg.practiceTask && (
                    <div className="px-4 py-3 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-sm text-emerald-200">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1">✏️ Your Turn — Practice Task</p>
                      {msg.practiceTask}
                    </div>
                  )}
                  {/* Correction */}
                  {msg.role === "alex" && msg.isCorrection && msg.correctedSentence && (
                    <div className="px-4 py-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-sm space-y-1">
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider">⚡ Corrected Version</p>
                      <p className="text-emerald-300 font-bold">"{msg.correctedSentence}"</p>
                    </div>
                  )}
                  {msg.role === "alex" && (
                    <button onClick={() => speakText(msg.content)} disabled={isSpeaking}
                      className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition disabled:opacity-40">
                      <Volume2 className="w-3 h-3" /> Hear Alex
                    </button>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white text-xs flex-shrink-0 mt-1">Y</div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-3 items-center">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm bg-gradient-to-br ${currentMod.color}`}>{currentMod.icon}</div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">Alex is explaining...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-3 bg-slate-900/90 flex-shrink-0">
            <AudioMeter isRecording={isRecording} />
            <div className="flex gap-2 mt-2">
              <button onClick={toggleRecording}
                className={`p-3 rounded-xl transition-all flex-shrink-0 ${isRecording ? "bg-rose-600 text-white animate-pulse" : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"}`}>
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <textarea value={textInput} onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={isRecording ? "Listening... speak now" : "Type your practice sentence or question..."}
                rows={1}
                className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none" />
              <button onClick={sendMessage} disabled={!textInput.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-xl transition-all flex-shrink-0">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── COURSE HOME ─────────────────────────────────────────────────────────────
  const totalLessons = CURRICULUM.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = completedLessons.size;

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      {/* Hero */}
      <div className="bg-gradient-to-b from-indigo-900/70 to-slate-950 pt-10 pb-20 border-b border-indigo-500/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/study/interview-prep/english-friend" className="text-indigo-300 hover:text-white flex items-center gap-2 text-sm font-bold mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to English Friend Alex
          </Link>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
                <GraduationCap className="w-3.5 h-3.5" /> English Course by Alex
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Learn English{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  From Scratch
                </span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                Alex teaches you step-by-step — Tenses, Vocabulary, Sentence Structure, Common Indian Mistakes & Fluency. Interactive lessons with voice, practice tasks and instant corrections.
              </p>
            </div>
            {/* Progress */}
            <div className="flex-shrink-0 bg-slate-900 border border-slate-700 rounded-2xl p-5 min-w-[200px]">
              <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Your Progress</p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-4xl font-black text-white">{completedCount}</span>
                <span className="text-slate-400 text-sm mb-1">/ {totalLessons} lessons</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalLessons ? (completedCount / totalLessons) * 100 : 0}%` }} />
              </div>
              <p className="text-xs text-slate-500">{totalLessons - completedCount} lessons remaining</p>
            </div>
          </div>

          {/* Voice Selector on Home */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-slate-400">Alex's Voice:</span>
            <div className="relative">
              <button onClick={() => setShowVoicePicker(!showVoicePicker)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                {selectedVoice ? selectedVoice.name.replace("Microsoft ", "").replace(" Online (Natural)", "").replace("Google ", "") : "Select Voice"}
                <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
              </button>
              {showVoicePicker && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                    <p className="text-xs font-black text-white">🎙️ Alex's Voice</p>
                    <button onClick={() => setShowVoicePicker(false)} className="text-slate-500 hover:text-white text-xs">✕</button>
                  </div>
                  <div className="overflow-y-auto max-h-72">
                    {regionGroups.map(region => {
                      const voices = availableVoices.filter(v => v.region === region);
                      if (voices.length === 0) return null;
                      return (
                        <div key={region}>
                          <div className="px-3 py-1.5 bg-slate-800/60 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {regionFlags[region]} {region} English
                          </div>
                          {voices.map((v, i) => (
                            <button key={i} onClick={() => { setSelectedVoice(v.voice); setShowVoicePicker(false); speakText("Hello! I am Alex, your English trainer. Let's start learning!"); }}
                              className={`w-full px-3 py-2.5 text-left flex justify-between items-center hover:bg-slate-800 transition ${selectedVoice?.name === v.voice.name ? "bg-emerald-900/30 border-l-2 border-emerald-400" : ""}`}>
                              <span className="text-sm text-white font-medium">{v.label}</span>
                              <div className="flex items-center gap-2">
                                {v.gender !== "Unknown" && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${v.gender === "Female" ? "bg-pink-900/60 text-pink-300" : "bg-blue-900/60 text-blue-300"}`}>
                                    {genderIcons[v.gender]} {v.gender}
                                  </span>
                                )}
                                {selectedVoice?.name === v.voice.name && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                              </div>
                            </button>
                          ))}
                        </div>
                      );
                    })}
                    {availableVoices.length === 0 && (
                      <p className="p-4 text-xs text-slate-400 text-center">No English voices detected. Use Chrome or Microsoft Edge for the best experience.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <span className="text-xs text-slate-500">Selecting a voice plays a preview</span>
            <div className="ml-auto">
              <ModelSelector value={preferredModel} onChange={setPreferredModel} />
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="container mx-auto px-4 max-w-5xl mt-10 space-y-8">
        {CURRICULUM.map((mod, mi) => (
          <div key={mod.id} className={`border ${mod.borderColor} ${mod.bgColor} rounded-3xl overflow-hidden`}>
            {/* Module Header */}
            <div
              className={`flex items-center gap-4 p-5 cursor-pointer`}
              onClick={() => setSelectedModule(selectedModule === mod.id ? null : mod.id)}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br ${mod.color} shadow-lg flex-shrink-0`}>
                {mod.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-black text-white">{mod.title}</h2>
                <p className="text-xs text-slate-400">{mod.lessons.length} lessons · {mod.lessons.filter(l => completedLessons.has(l.id)).length} completed</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-slate-800 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full bg-gradient-to-r ${mod.color} transition-all`}
                    style={{ width: `${(mod.lessons.filter(l => completedLessons.has(l.id)).length / mod.lessons.length) * 100}%` }} />
                </div>
                <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${selectedModule === mod.id ? "rotate-90" : ""}`} />
              </div>
            </div>

            {/* Lessons List */}
            {selectedModule === mod.id && (
              <div className="border-t border-white/10 divide-y divide-white/5">
                {mod.lessons.map((lesson, li) => {
                  const done = completedLessons.has(lesson.id);
                  return (
                    <div key={lesson.id} className="flex items-center gap-4 p-4 hover:bg-white/5 transition group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${done ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                        {done ? <CheckCircle className="w-4 h-4" /> : li + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm ${done ? "text-emerald-400" : "text-white"}`}>{lesson.title}</p>
                        <p className="text-xs text-slate-500 truncate">{lesson.desc}</p>
                      </div>
                      <button
                        onClick={() => startLesson(mod, lesson)}
                        className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                          done
                            ? "bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60"
                            : `bg-gradient-to-r ${mod.color} text-white shadow-md hover:scale-105`
                        }`}
                      >
                        {done ? <><RefreshCw className="w-3.5 h-3.5" /> Redo</> : <><Play className="w-3.5 h-3.5" /> Start</>}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
