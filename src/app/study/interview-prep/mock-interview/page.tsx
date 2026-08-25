"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Loader2, PlayCircle, StopCircle, ArrowLeft, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModelSelector, AIModel } from "@/components/ModelSelector";

type Message = {
  role: "interviewer" | "candidate";
  content: string;
};

export default function MockInterviewPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [role, setRole] = useState("Software Engineer");
  const [level, setLevel] = useState("Junior");
  const [preferredModel, setPreferredModel] = useState<AIModel>("deepseek");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState("");
  
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    // Initialize Web Speech API Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = "en-US";
        
        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setTextInput(prev => prev + " " + transcript);
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
      window.speechSynthesis.cancel(); // Stop speaking if component unmounts
    };
  }, []);

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel(); // cancel any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const goodVoice = voices.find(v => v.lang === "en-US" && v.name.includes("Google")) || voices.find(v => v.lang.startsWith("en"));
    if (goodVoice) utterance.voice = goodVoice;

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
      stopSpeaking(); // stop AI speaking when user starts talking
      recognition.start();
      setIsRecording(true);
    }
  };

  const startInterview = async () => {
    setIsStarted(true);
    setIsLoading(true);
    try {
      const response = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: [], role, level, preferredModel })
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setMessages([{ role: "interviewer", content: data.text }]);
      speakText(data.text);
    } catch (err: any) {
      alert("Error starting interview: " + err.message);
      setIsStarted(false);
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
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: updatedMessages, role, level, preferredModel })
      });
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      setMessages(prev => [...prev, { role: "interviewer", content: data.text }]);
      speakText(data.text);
    } catch (err: any) {
      alert("Error generating response: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl">
          <Link href="/study/interview-prep" className="text-zinc-400 hover:text-white flex items-center gap-2 mb-6 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Prep
          </Link>
          
          <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/30">
            <Mic className="w-8 h-8" />
          </div>
          
          <h1 className="text-3xl font-black mb-2">AI Voice Mock Interviewer</h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">Practice your interviewing skills with a realistic AI that speaks to you. Answer out loud or type your responses.</p>
          
          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-bold mb-2 text-zinc-300">Target Role</label>
              <input 
                type="text" 
                value={role} 
                onChange={e => setRole(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                placeholder="e.g. Software Engineer, Product Manager"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 text-zinc-300">Experience Level</label>
              <select 
                value={level} 
                onChange={e => setLevel(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
              >
                <option>Junior</option>
                <option>Mid-Level</option>
                <option>Senior</option>
                <option>Lead / Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-zinc-300">AI Engine</label>
              <ModelSelector value={preferredModel} onChange={setPreferredModel} />
            </div>
          </div>
          
          <Button onClick={startInterview} disabled={isLoading} className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-purple-900/50">
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Start Interview"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <Link href="/study/interview-prep" className="text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-bold">{role} Interview</h1>
            <p className="text-xs text-zinc-400">{level} Level</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isSpeaking && (
            <button onClick={stopSpeaking} className="text-red-400 hover:bg-red-400/10 p-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-colors">
              <StopCircle className="w-4 h-4" /> Stop Audio
            </button>
          )}
          <span className="flex items-center gap-2 text-xs font-bold bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] flex gap-3 ${msg.role === 'candidate' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'candidate' ? 'bg-zinc-700' : 'bg-purple-600'}`}>
                {msg.role === 'candidate' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'candidate' ? 'bg-zinc-800 text-zinc-100 rounded-tr-sm' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm'}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 bg-purple-600">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 rounded-tl-sm flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-zinc-900 border-t border-zinc-800 p-4">
        <div className="max-w-4xl mx-auto flex items-end gap-2 bg-zinc-950 p-2 rounded-2xl border border-zinc-800 focus-within:border-purple-500/50 transition-colors">
          <button 
            onClick={toggleRecording}
            className={`p-4 rounded-xl flex-shrink-0 transition-colors ${isRecording ? 'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse' : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
            title={isRecording ? "Stop Recording" : "Start Voice Input"}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <textarea 
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type your answer, or click the mic to speak..."
            className="flex-1 bg-transparent border-none text-white p-3 resize-none focus:outline-none max-h-32 min-h-[56px]"
            rows={textInput.split('\n').length || 1}
          />
          
          <button 
            onClick={handleSendMessage}
            disabled={!textInput.trim() || isLoading}
            className="p-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 rounded-xl flex-shrink-0 text-white transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-zinc-500 mt-3 font-medium">
          Make sure your browser allows microphone access. Use headphones to prevent echo.
        </p>
      </div>
    </div>
  );
}
