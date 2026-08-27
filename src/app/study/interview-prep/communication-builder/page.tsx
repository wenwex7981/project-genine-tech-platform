"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Loader2, ArrowLeft, CheckCircle2, AlertTriangle, BarChart, Volume2, Video, VideoOff, Sparkles, Copy, Check, Clock, MessageSquare, Flame, Award, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModelSelector, AIModel } from "@/components/ModelSelector";
import { AnimatedAvatar } from "@/components/AnimatedAvatar";
import { Avatar3D } from "@/components/Avatar3D";
import { AudioMeter } from "@/components/AudioMeter";

type PracticeMode = "60s_self_intro" | "30s_pitch" | "90s_presentation" | "impromptu";

type FillerWord = {
  word: string;
  count: number;
};

type EvaluationReport = {
  overallScore: number;
  metrics: {
    fluency: number;
    vocabularyQuality: number;
    structureAndFlow: number;
    fillerWordControl: number;
    confidenceAndTone: number;
  };
  wordsPerMinute: number;
  wpmAnalysis: string;
  fillerWordsFound: FillerWord[];
  strengths: string[];
  areasToPolish: string[];
  speechRhythmAdvice: string;
  perfectRewrittenScript: string;
};

const MODE_CONFIGS: Record<PracticeMode, { title: string; duration: number; desc: string; icon: string }> = {
  "60s_self_intro": {
    title: "60s 'Tell Me About Yourself'",
    duration: 60,
    desc: "The #1 placement question. Master a balanced 1-minute intro covering background, skills, and goals.",
    icon: "🎯",
  },
  "30s_pitch": {
    title: "30s Elevator Pitch",
    duration: 30,
    desc: "Fast, high-impact intro for networking, career fairs, and quick HR rounds.",
    icon: "⚡",
  },
  "90s_presentation": {
    title: "90s Deep Dive Intro",
    duration: 90,
    desc: "Comprehensive intro including project details, achievements, and career motivation.",
    icon: "🚀",
  },
  "impromptu": {
    title: "Impromptu Topic Speaking",
    duration: 60,
    desc: "Speak on a randomly generated topic to overcome hesitation and build quick thinking skills.",
    icon: "💡",
  },
};

const IMPROMPTU_TOPICS = [
  "Explain your favorite final year project in simple words.",
  "What is the biggest technical challenge you solved recently?",
  "Why did you choose your branch of engineering?",
  "Where do you see yourself in 3 years in the tech industry?",
  "Describe a time you worked in a team under tight deadlines.",
  "Why should a company hire a fresher like you today?",
];

export default function CommunicationBuilderPage() {
  const [uiState, setUiState] = useState<"setup" | "session" | "report">("setup");

  // Setup State
  const [mode, setMode] = useState<PracticeMode>("60s_self_intro");
  const [role, setRole] = useState("Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [targetAudience, setTargetAudience] = useState("Campus Placement Recruiter");
  const [preferredModel, setPreferredModel] = useState<AIModel>("groq");
  const [avatarVariant, setAvatarVariant] = useState<"robot" | "minion" | "human">("human");
  const [impromptuTopic, setImpromptuTopic] = useState("");

  // Webcam State
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    webcamStreamRef.current = webcamStream;
  }, [webcamStream]);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setWebcamStream(stream);
    } catch (err) {
      console.error("Error accessing webcam:", err);
      alert("Could not access webcam. Please check camera permissions.");
      setIsWebcamOn(false);
    }
  };

  const stopWebcam = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach(track => track.stop());
      setWebcamStream(null);
    }
  };

  useEffect(() => {
    if (uiState === "session" && isWebcamOn) {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isWebcamOn, uiState]);

  useEffect(() => {
    if (videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);

  // Session State
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Report State
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
          setTranscript(currentTranscript.trim());
        };

        rec.onend = () => {
          setIsRecording(false);
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsRecording(false);
        };

        setRecognition(rec);
      }
    }
  }, []);

  // Timer logic during session
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (uiState === "session" && isRecording) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleStopAndEvaluate();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [uiState, isRecording]);

  const handlePickRandomTopic = () => {
    const random = IMPROMPTU_TOPICS[Math.floor(Math.random() * IMPROMPTU_TOPICS.length)];
    setImpromptuTopic(random);
  };

  const startSession = () => {
    const config = MODE_CONFIGS[mode];
    setTimeRemaining(config.duration);
    setTimeElapsed(0);
    setTranscript("");
    if (mode === "impromptu" && !impromptuTopic) {
      handlePickRandomTopic();
    }
    setUiState("session");
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in this browser. You can type your response into the box below.");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      try {
        recognition.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error starting recognition:", err);
      }
    }
  };

  const handleStopAndEvaluate = async () => {
    if (isRecording && recognition) {
      recognition.stop();
      setIsRecording(false);
    }

    if (!transcript || transcript.trim().length < 10) {
      alert("Please speak or type at least a few sentences before submitting for evaluation!");
      return;
    }

    setIsLoading(true);
    setUiState("report");

    try {
      const payload = {
        transcript,
        mode,
        timeTakenSeconds: timeElapsed || (MODE_CONFIGS[mode].duration - timeRemaining),
        role,
        experienceLevel,
        targetAudience,
        preferredModel,
      };

      const response = await fetch('/api/communication-builder/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setReport(data);
    } catch (err: any) {
      alert("Error evaluating speech: " + err.message);
      setUiState("setup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyScript = () => {
    if (report?.perfectRewrittenScript) {
      navigator.clipboard.writeText(report.perfectRewrittenScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper for live cue card highlights
  const getCueCardPhase = () => {
    const total = MODE_CONFIGS[mode].duration;
    const progress = (timeElapsed / total) * 100;
    if (progress < 25) return { step: 1, title: "1. Greeting & Background", hint: "State your name, degree, and university clearly." };
    if (progress < 75) return { step: 2, title: "2. Skills & Top Project", hint: "Highlight your key technical stack and major project achievement." };
    return { step: 3, title: "3. Career Goal & Value", hint: "Conclude with your ambition and why you're excited for this role." };
  };

  // --- UI Renders ---

  if (uiState === "setup") {
    return (
      <div className="min-h-screen bg-slate-950 text-white pb-20 selection:bg-purple-500/30">
        <div className="bg-gradient-to-b from-purple-900/60 to-slate-950 pt-10 pb-24 border-b border-purple-500/20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Link href="/study" className="text-purple-300 hover:text-white flex items-center gap-2 text-sm font-bold mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Study Hub
            </Link>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> AI Speech & Fluency Trainer
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              English Communication &<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
                Self-Intro Builder
              </span>
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
              Overcome speaking fear, eliminate pauses and filler words ("um", "like"), and master fluent 30s to 90s self-introductions with live AI feedback.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl -mt-14">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-10 space-y-8">
            
            {/* Mode Selector */}
            <div>
              <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" /> Select Practice Mode
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {(Object.keys(MODE_CONFIGS) as PracticeMode[]).map((mKey) => {
                  const cfg = MODE_CONFIGS[mKey];
                  const isSelected = mode === mKey;
                  return (
                    <div
                      key={mKey}
                      onClick={() => setMode(mKey)}
                      className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-purple-900/40 border-purple-500 ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/10' 
                          : 'bg-slate-800/50 border-slate-700/80 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-2xl">{cfg.icon}</span>
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-950/60 border border-white/10 text-purple-300">
                            {cfg.duration}s Timer
                          </span>
                        </div>
                        <h4 className="font-bold text-lg text-white mb-1">{cfg.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{cfg.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Impromptu Topic Generator Box */}
            {mode === "impromptu" && (
              <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-purple-300">Your Random Topic</label>
                  <button 
                    onClick={handlePickRandomTopic}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Pick Another Topic
                  </button>
                </div>
                <p className="text-lg font-bold text-white italic">
                  "{impromptuTopic || "Click button to generate a topic!"}"
                </p>
              </div>
            )}

            {/* Target Settings */}
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white border-b border-slate-800 pb-2">Target Profile</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">Target Position / Role</label>
                  <input 
                    type="text" 
                    value={role} 
                    onChange={e => setRole(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-purple-500 text-sm" 
                    placeholder="e.g. Software Engineer, Marketing Associate" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1">Experience</label>
                    <input 
                      type="text" 
                      value={experienceLevel} 
                      onChange={e => setExperienceLevel(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-purple-500 text-sm" 
                      placeholder="e.g. Fresher, 1 Year" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-1">Audience</label>
                    <select 
                      value={targetAudience} 
                      onChange={e => setTargetAudience(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    >
                      <option>Campus Placement Recruiter</option>
                      <option>Technical Team Lead</option>
                      <option>HR Manager</option>
                      <option>Networking Event</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg text-white border-b border-slate-800 pb-2">Coach Settings</h3>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">Avatar Partner</label>
                  <select 
                    value={avatarVariant} 
                    onChange={e => setAvatarVariant(e.target.value as any)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  >
                    <option value="human">Human Interviewer</option>
                    <option value="robot">High-Tech AI Coach</option>
                    <option value="minion">Minion Companion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-1">AI Evaluation Engine</label>
                  <ModelSelector value={preferredModel} onChange={setPreferredModel} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Webcam Mode</label>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setIsWebcamOn(true)}
                      className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        isWebcamOn ? 'bg-purple-600 text-white border-purple-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      <Video className="w-4 h-4" /> Camera On
                    </button>
                    <button 
                      type="button"
                      onClick={() => setIsWebcamOn(false)}
                      className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        !isWebcamOn ? 'bg-purple-600 text-white border-purple-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      <VideoOff className="w-4 h-4" /> Camera Off
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={startSession} 
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-lg rounded-xl shadow-xl shadow-purple-600/20"
            >
              Start Speech Practice ({MODE_CONFIGS[mode].duration}s)
            </Button>

          </div>
        </div>
      </div>
    );
  }

  if (uiState === "session") {
    const cue = getCueCardPhase();
    return (
      <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-slate-950 text-white">
        
        <div className={`w-full ${isWebcamOn ? 'max-w-6xl' : 'max-w-4xl'} flex flex-col min-h-[90vh] z-20 mt-2 relative`}>
          
          {/* Header */}
          <div className="flex justify-between items-center mb-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl font-black text-white">{MODE_CONFIGS[mode].title}</h2>
                <p className="text-xs text-purple-300">{role} • {targetAudience}</p>
              </div>
              <div className={`px-3.5 py-1.5 rounded-xl flex items-center gap-2 border font-mono font-bold text-sm ${
                timeRemaining <= 10 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse' 
                  : 'bg-purple-500/20 text-purple-200 border-purple-500/30'
              }`}>
                <Clock className="w-4 h-4 text-purple-400" />
                <span>{timeRemaining}s</span>
              </div>
            </div>

            <div className="flex gap-2 md:gap-3">
              <button 
                onClick={() => setIsWebcamOn(!isWebcamOn)} 
                className={`px-3 md:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition backdrop-blur-md border ${
                  isWebcamOn ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-purple-600 text-white border-purple-500'
                }`}
              >
                {isWebcamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span>{isWebcamOn ? "Camera On" : "Camera Off"}</span>
              </button>

              <button 
                onClick={handleStopAndEvaluate} 
                disabled={isLoading}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-black hover:opacity-90 transition shadow-lg"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Stop & Evaluate"}
              </button>
            </div>
          </div>

          {/* Main Practice Workspace Grid */}
          <div className={`flex-1 grid grid-cols-1 ${isWebcamOn ? 'lg:grid-cols-2' : ''} gap-6 w-full min-h-0`}>
            
            {/* Left Column: Avatar & Live Cue Card & Transcript */}
            <div className="flex flex-col h-full justify-between gap-4">
              
              <div className="flex-1 flex flex-col items-center justify-start w-full min-h-0 pt-2">
                {/* Avatar */}
                <div className="z-30 w-36 h-36 md:w-44 md:h-44 mb-0 pointer-events-none drop-shadow-2xl flex-shrink-0">
                  {avatarVariant === 'minion' ? (
                    <Avatar3D isSpeaking={isRecording} modelUrl="/models/Minion.glb" />
                  ) : (
                    <AnimatedAvatar isSpeaking={isRecording} variant={avatarVariant} className="w-full h-full" />
                  )}
                </div>

                {/* Live Speech Cue Card & Prompt Box */}
                <div className="w-full max-w-3xl bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl flex flex-col items-center text-center flex-1 min-h-0 relative">
                  
                  {/* Live Phase Step Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold mb-3">
                    <span>{cue.title}</span>
                  </div>

                  <p className="text-sm text-slate-300 mb-4 font-medium italic">
                    "{cue.hint}"
                  </p>

                  {mode === "impromptu" && (
                    <div className="w-full bg-purple-950/30 border border-purple-500/20 rounded-xl p-3 mb-3 text-xs text-purple-200 font-bold">
                      Topic: {impromptuTopic}
                    </div>
                  )}

                  {/* Live Transcript Display Box */}
                  <div className="w-full flex-1 bg-slate-950/80 border border-white/10 rounded-2xl p-4 overflow-y-auto custom-scrollbar text-left text-sm text-slate-200 leading-relaxed font-mono min-h-[120px]">
                    {transcript ? (
                      <span>{transcript}</span>
                    ) : (
                      <span className="text-slate-500 italic">
                        {isRecording ? "Listening... Speak your self-introduction into the microphone now!" : "Click 'Tap to Speak' below to start recording..."}
                      </span>
                    )}
                  </div>

                </div>
              </div>

              {/* Controls & Input */}
              <div className="bg-slate-900/90 backdrop-blur-xl p-3 rounded-2xl shadow-xl border border-white/10 flex flex-col w-full flex-shrink-0 gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleRecording}
                    className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm transition-all flex-1 ${
                      isRecording 
                        ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_20px_rgba(225,29,72,0.5)]' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    <span>{isRecording ? "Listening... (Tap to Pause)" : "Tap to Speak"}</span>
                  </button>

                  <button
                    onClick={handleStopAndEvaluate}
                    disabled={!transcript.trim() || isLoading}
                    className="px-6 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-sm rounded-xl transition shadow-lg flex items-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    <span>Evaluate</span>
                  </button>
                </div>
                <AudioMeter isRecording={isRecording} />
              </div>

            </div>

            {/* Right Column: Webcam Feed (Only visible if isWebcamOn is true) */}
            {isWebcamOn && (
              <div className="flex flex-col bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-3xl p-5 overflow-hidden relative shadow-2xl h-[350px] lg:h-full lg:min-h-[450px]">
                <div className="text-xs font-bold text-purple-200 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2"><Video className="w-4 h-4 text-purple-400" /> Live Webcam Feed</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">LIVE</span>
                  </div>
                </div>
                
                <div className="flex-1 relative bg-black/80 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center min-h-[220px]">
                  {webcamStream ? (
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      style={{ transform: "scaleX(-1)" }}
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                      <p className="text-xs font-medium">Requesting camera access...</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    );
  }

  // uiState === "report"
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 selection:bg-purple-500/30">
      <div className="bg-gradient-to-b from-purple-900/50 to-slate-950 pt-10 pb-24 border-b border-purple-500/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link href="/study" className="text-purple-300 hover:text-white flex items-center gap-2 text-sm font-bold mb-6">
            <ArrowLeft className="w-4 h-4" /> Exit Report
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Speech & Fluency Report</h1>
              <p className="text-purple-300 text-sm">Detailed AI analysis for your {MODE_CONFIGS[mode].title}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-16">
        {!report ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-2xl">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
            <h3 className="text-2xl font-black text-white mb-2">Analyzing your speech & fluency...</h3>
            <p className="text-slate-400 max-w-md text-sm">Our AI is measuring your words-per-minute (WPM), scanning for filler words ("um", "like"), evaluating vocabulary, and crafting your ideal self-intro script.</p>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Top Score Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Overall Score */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
                <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Fluency & Communication Score</p>
                <div className="relative w-36 h-36 rounded-full flex items-center justify-center border-8 border-purple-950 mb-3 shadow-inner">
                  <div className="absolute inset-0 border-8 border-purple-500 rounded-full border-t-transparent border-r-transparent rotate-45"></div>
                  <span className="text-5xl font-black text-white">{report.overallScore}</span>
                  <span className="absolute bottom-5 text-xs font-bold text-slate-400">/ 100</span>
                </div>
                <p className="font-bold text-sm text-slate-200">
                  {report.overallScore >= 80 ? 'Fluent & Confident! 🌟' : report.overallScore >= 65 ? 'Good Flow, Needs Polish 👍' : 'Keep Practicing! 📚'}
                </p>
              </div>

              {/* Speech Rate (WPM) Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-bold text-purple-400 uppercase tracking-widest">Speech Rate (WPM)</p>
                    <Zap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-4xl font-black text-white mb-2">
                    {report.wordsPerMinute} <span className="text-sm font-normal text-slate-400">words/min</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-white/5">
                    {report.wpmAnalysis}
                  </p>
                </div>
                <div className="text-[11px] text-slate-400 pt-3">
                  Ideal English speaking pace for interviews is 120–150 WPM.
                </div>
              </div>

              {/* Filler Words Breakdown */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Filler Words Detected</p>
                  {report.fillerWordsFound && report.fillerWordsFound.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {report.fillerWordsFound.map((fw, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1.5">
                          "{fw.word}" <span className="bg-rose-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">{fw.count}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-300 font-bold mb-4">
                      ✓ Flawless! Zero filler words ("um", "like", "basically") detected.
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {report.speechRhythmAdvice}
                </p>
              </div>

            </div>

            {/* Detailed Metrics */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-6">Detailed Communication Metrics</h4>
              <div className="space-y-4">
                {Object.entries(report.metrics).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span>{val} / 100</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full rounded-full ${val >= 80 ? 'bg-emerald-500' : val >= 65 ? 'bg-amber-400' : 'bg-rose-500'}`} 
                        style={{ width: `${val}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Polish Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-3xl p-6">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Key Strengths
                </p>
                <ul className="space-y-2.5">
                  {report.strengths.map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-xs text-emerald-200 font-medium">
                      <span className="text-emerald-400 font-bold">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-950/30 border border-rose-500/30 rounded-3xl p-6">
                <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Areas to Polish
                </p>
                <ul className="space-y-2.5">
                  {report.areasToPolish.map((item, i) => (
                    <li key={i} className="flex gap-2.5 text-xs text-rose-200 font-medium">
                      <span className="text-rose-400 font-bold">⚠</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* IDEAL REWRITTEN SCRIPT BOX */}
            <div className="bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/40 rounded-3xl p-8 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
                    <Sparkles className="w-4 h-4" /> Your Polished Ideal Self-Intro Script
                  </div>
                  <h3 className="text-xl font-bold text-white">Memorize & Practice This Version</h3>
                </div>
                <button
                  onClick={handleCopyScript}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "Copied Script!" : "Copy Script"}</span>
                </button>
              </div>

              <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 text-sm text-slate-200 leading-relaxed font-sans shadow-inner">
                "{report.perfectRewrittenScript}"
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => setUiState("setup")} 
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 h-12 rounded-xl shadow-lg"
                >
                  Practice Another Intro
                </Button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
