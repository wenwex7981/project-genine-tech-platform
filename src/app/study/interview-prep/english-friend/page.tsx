"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Loader2, ArrowLeft, Volume2, StopCircle, Sparkles, RefreshCw, Video, VideoOff, CheckCircle, AlertCircle, MessageCircle, Zap, Heart } from "lucide-react";
import Link from "next/link";
import { ModelSelector, AIModel } from "@/components/ModelSelector";
import { AnimatedAvatar } from "@/components/AnimatedAvatar";
import { AudioMeter } from "@/components/AudioMeter";

type Message = {
  role: "user" | "alex";
  content: string;
  corrections?: Correction[];
  encouragement?: string;
};

type Correction = {
  original: string;
  fixed: string;
  tip: string;
};

const CONVERSATION_TOPICS = [
  { id: "general", label: "💬 Free Chat", desc: "Talk about anything — daily life, hobbies, goals" },
  { id: "self_intro", label: "🎯 Self Introduction", desc: "Practice your intro: name, background, skills, goals" },
  { id: "college_life", label: "🎓 College & Projects", desc: "Talk about your studies, final year project, internships" },
  { id: "career_goals", label: "🚀 Career Goals", desc: "Discuss your dream job, plans after college, companies" },
  { id: "current_affairs", label: "📰 Current Affairs", desc: "Practice discussing news, tech trends, and opinions" },
  { id: "storytelling", label: "📖 Storytelling", desc: "Tell stories about your experiences and achievements" },
];

export default function EnglishFriendPage() {
  const [uiState, setUiState] = useState<"setup" | "chat">("setup");
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [preferredModel, setPreferredModel] = useState<AIModel>("groq");
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    webcamStreamRef.current = webcamStream;
  }, [webcamStream]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setWebcamStream(stream);
    } catch {
      alert("Could not access webcam. Please check camera permissions.");
      setIsWebcamOn(false);
    }
  };

  const stopWebcam = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(t => t.stop());
      setWebcamStream(null);
    }
  };

  useEffect(() => {
    if (uiState === "chat" && isWebcamOn) startWebcam();
    else stopWebcam();
    return () => {
      if (webcamStreamRef.current) webcamStreamRef.current.getTracks().forEach(t => t.stop());
    };
  }, [isWebcamOn, uiState]);

  useEffect(() => {
    if (videoRef.current && webcamStream) videoRef.current.srcObject = webcamStream;
  }, [webcamStream]);

  useEffect(() => {
    // Load voices
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };
    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Speech recognition
    if (typeof window !== "undefined") {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = "en-US";
        rec.onresult = (e: any) => {
          for (let i = e.resultIndex; i < e.results.length; ++i) {
            if (e.results[i].isFinal) {
              setTextInput(prev => prev + (prev ? " " : "") + e.results[i][0].transcript);
            }
          }
        };
        rec.onend = () => setIsRecording(false);
        rec.onerror = () => setIsRecording(false);
        setRecognition(rec);
      }
    }
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const liveVoices = window.speechSynthesis.getVoices();
    const preferred = liveVoices.find(v => v.lang === "en-US" && v.name.includes("Google")) || liveVoices.find(v => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => { window.speechSynthesis.cancel(); setIsSpeaking(false); };

  const toggleRecording = () => {
    if (!recognition) { alert("Voice recognition not supported. Please type."); return; }
    if (isRecording) { recognition.stop(); }
    else { stopSpeaking(); recognition.start(); setIsRecording(true); }
  };

  const sendMessage = async (msgOverride?: string) => {
    const userMsg = (msgOverride ?? textInput).trim();
    if (!userMsg || isLoading) return;

    stopSpeaking();
    if (isRecording && recognition) { recognition.stop(); setIsRecording(false); }
    setTextInput("");

    const newUserMessage: Message = { role: "user", content: userMsg };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const history = updatedMessages.slice(-12).map(m => ({ role: m.role, content: m.content }));
      const response = await fetch("/api/english-friend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: history.slice(0, -1), userMessage: userMsg, preferredModel, topic: selectedTopic }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const alexMsg: Message = {
        role: "alex",
        content: data.friendReply || "Hey! I'm here, say something!",
        corrections: data.corrections || [],
        encouragement: data.encouragement || "",
      };

      setMessages(prev => [...prev, alexMsg]);
      speakText(alexMsg.content);
    } catch (err: any) {
      alert("Error connecting to Alex: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startChat = () => {
    setMessages([]);
    setUiState("chat");
    // Auto-greet after a short delay
    setTimeout(async () => {
      setIsLoading(true);
      try {
        const topicLabel = CONVERSATION_TOPICS.find(t => t.id === selectedTopic)?.label || "general chat";
        const greetResponse = await fetch("/api/english-friend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history: [], userMessage: `Hello! I want to practice English. Let's talk about: ${topicLabel}`, preferredModel, topic: selectedTopic }),
        });
        const data = await greetResponse.json();
        const greetMsg: Message = {
          role: "alex",
          content: data.friendReply || "Hey! Great to meet you! I'm Alex, your English practice buddy. What's on your mind today?",
          corrections: [],
          encouragement: "",
        };
        setMessages([greetMsg]);
        speakText(greetMsg.content);
      } catch {
        const fallbackMsg: Message = { role: "alex", content: "Hey! Great to meet you! I'm Alex, your English practice buddy. Go ahead and start talking — don't be shy! What's on your mind today?", corrections: [], encouragement: "" };
        setMessages([fallbackMsg]);
        speakText(fallbackMsg.content);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  // --- SETUP UI ---
  if (uiState === "setup") {
    return (
      <div className="min-h-screen bg-slate-950 text-white pb-20">
        <div className="bg-gradient-to-b from-emerald-900/60 to-slate-950 pt-10 pb-24 border-b border-emerald-500/20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link href="/study" className="text-emerald-300 hover:text-white flex items-center gap-2 text-sm font-bold mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Study Hub
            </Link>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> Your Personal English Friend
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Chat with AI&nbsp;
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                English Friend
              </span>
              &nbsp;"Alex"
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
              Talk freely in English. Alex listens like a real friend — replies naturally, <strong className="text-white">gently corrects</strong> your mistakes on the spot, and keeps the conversation flowing. No fear, just practice!
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <div className="flex items-center gap-2 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
                <CheckCircle className="w-4 h-4" /> Instant grammar correction
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
                <Volume2 className="w-4 h-4" /> Alex speaks back (voice)
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
                <Mic className="w-4 h-4" /> Speak or type freely
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl -mt-14">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-10 space-y-8">

            {/* Topic Selection */}
            <div>
              <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-400" /> What do you want to talk about?
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CONVERSATION_TOPICS.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTopic(t.id)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 ${
                      selectedTopic === t.id
                        ? "bg-emerald-900/40 border-emerald-500 ring-2 ring-emerald-500/40"
                        : "bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800"
                    }`}
                  >
                    <p className="font-bold text-sm text-white mb-1">{t.label}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">AI Engine for Alex</label>
                <ModelSelector value={preferredModel} onChange={setPreferredModel} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Webcam (Optional)</label>
                <div className="flex gap-2">
                  <button onClick={() => setIsWebcamOn(true)} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${isWebcamOn ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900"}`}>
                    <Video className="w-4 h-4" /> Camera On
                  </button>
                  <button onClick={() => setIsWebcamOn(false)} className={`flex-1 py-3 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${!isWebcamOn ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900"}`}>
                    <VideoOff className="w-4 h-4" /> Camera Off
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={startChat}
              className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-lg rounded-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" /> Start Chatting with Alex!
            </button>

          </div>
        </div>
      </div>
    );
  }

  // --- CHAT UI ---
  const topicLabel = CONVERSATION_TOPICS.find(t => t.id === selectedTopic)?.label || "Chat";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setUiState("setup")} className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-lg shadow-lg">A</div>
          <div>
            <p className="font-black text-white text-sm">Alex — Your English Friend</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-xs text-emerald-400 font-medium">{isSpeaking ? "Speaking..." : "Online • " + topicLabel}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isSpeaking && (
            <button onClick={stopSpeaking} className="px-3 py-2 bg-rose-600/80 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-rose-600 transition">
              <StopCircle className="w-4 h-4" /> Stop
            </button>
          )}
          <button
            onClick={() => setIsWebcamOn(!isWebcamOn)}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border ${isWebcamOn ? "bg-emerald-600 text-white border-emerald-500" : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"}`}
          >
            {isWebcamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{isWebcamOn ? "Camera On" : "Camera Off"}</span>
          </button>
          <button onClick={() => { setMessages([]); startChat(); }} className="px-3 py-2 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition">
            <RefreshCw className="w-4 h-4" /> New Chat
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className={`flex-1 flex ${isWebcamOn ? "flex-row" : "flex-col"} overflow-hidden`}>

        {/* Chat Column */}
        <div className={`${isWebcamOn ? "flex-1" : "w-full"} flex flex-col overflow-hidden`}>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3 items-end`}>
                
                {msg.role === "alex" && (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-sm shadow-md flex-shrink-0">A</div>
                )}

                <div className={`max-w-[80%] space-y-2`}>
                  {/* Main message bubble */}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-sm"
                  }`}>
                    {msg.content}
                  </div>

                  {/* Encouragement badge */}
                  {msg.role === "alex" && msg.encouragement && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-medium">
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" /> {msg.encouragement}
                    </div>
                  )}

                  {/* Corrections Box */}
                  {msg.role === "alex" && msg.corrections && msg.corrections.length > 0 && (
                    <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-3 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
                        <Zap className="w-3.5 h-3.5" /> Quick English Fix 💡
                      </div>
                      {msg.corrections.map((c, ci) => (
                        <div key={ci} className="space-y-1">
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="line-through text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg">"{c.original}"</span>
                            <span className="text-slate-400">→</span>
                            <span className="text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg font-bold">"{c.fixed}"</span>
                          </div>
                          <p className="text-[11px] text-slate-400 pl-1">{c.tip}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Replay button for Alex messages */}
                  {msg.role === "alex" && (
                    <button
                      onClick={() => speakText(msg.content)}
                      disabled={isSpeaking}
                      className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition disabled:opacity-50"
                    >
                      <Volume2 className="w-3 h-3" /> Replay Alex's voice
                    </button>
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white text-sm shadow-md flex-shrink-0">Y</div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start gap-3 items-end">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-sm shadow-md flex-shrink-0">A</div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span className="text-xs text-slate-400">Alex is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-white/10 p-3 bg-slate-900/90 flex-shrink-0">
            <AudioMeter isRecording={isRecording} />
            <div className="flex gap-2 mt-2">
              <button
                onClick={toggleRecording}
                className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                  isRecording
                    ? "bg-rose-600 text-white animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                }`}
                title={isRecording ? "Stop recording" : "Speak"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <textarea
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder={isRecording ? "Listening... (speak now, then press Send)" : "Type or speak to Alex..."}
                rows={1}
                className="flex-1 bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
              />

              <button
                onClick={() => sendMessage()}
                disabled={!textInput.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-xl transition-all flex-shrink-0 shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Webcam Column */}
        {isWebcamOn && (
          <div className="w-72 xl:w-80 border-l border-white/10 bg-slate-900 flex flex-col p-4 gap-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-2"><Video className="w-3.5 h-3.5 text-emerald-400" /> Your Camera</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[10px] text-slate-400 font-mono font-bold">LIVE</span>
              </div>
            </div>
            <div className="flex-1 bg-black rounded-2xl overflow-hidden border border-white/5 relative flex items-center justify-center min-h-[200px]">
              {webcamStream ? (
                <video ref={videoRef} autoPlay playsInline muted style={{ transform: "scaleX(-1)" }} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  <p className="text-xs">Connecting camera...</p>
                </div>
              )}
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3 text-xs text-slate-400 border border-slate-700">
              💡 <strong className="text-slate-300">Tip:</strong> Practice looking at the camera when you speak. It helps build confidence for real interviews!
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
