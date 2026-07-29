"use client";

import Link from "next/link";
import { BookOpen, Map, GraduationCap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StudyHubPage() {
  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="bg-primary/5 py-24 border-b">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 border border-primary/20">
            <GraduationCap className="h-4 w-4" /> The Ultimate Study Hub
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6">
            Master your <span className="text-primary">Career Journey</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Everything you need to crack your dream job. From AI-generated career roadmaps to premium interview questions asked by top tech companies.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-16 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Interview Prep Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen className="h-40 w-40" />
            </div>
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 z-10">
              <BookOpen className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4 z-10">Premium Interview Prep</h2>
            <p className="text-muted-foreground mb-8 text-lg z-10 flex-grow">
              Access hundreds of real interview questions asked by Deloitte, FAANG, and top startups. Download complete PDFs with solutions.
            </p>
            <ul className="space-y-3 mb-8 z-10">
              <li className="flex items-center gap-2 font-medium"><CheckCircle className="h-5 w-5 text-emerald-500" /> Company-specific questions</li>
              <li className="flex items-center gap-2 font-medium"><CheckCircle className="h-5 w-5 text-emerald-500" /> Role-specific technical rounds</li>
              <li className="flex items-center gap-2 font-medium"><CheckCircle className="h-5 w-5 text-emerald-500" /> Instantly unlocks to dashboard</li>
            </ul>
            <Link href="/study/interview-prep" className="z-10 mt-auto">
              <Button size="lg" className="w-full text-lg h-14 rounded-xl">Browse Documents</Button>
            </Link>
          </div>

          {/* AI Career Guidance Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden group flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Map className="h-40 w-40" />
            </div>
            <div className="h-16 w-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-6 z-10">
              <Map className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4 z-10">AI Career Guidance</h2>
            <p className="text-indigo-200 mb-8 text-lg z-10 flex-grow">
              Confused after graduation? Let our ultra-fast Groq AI analyze your goals and generate a personalized, month-by-month roadmap.
            </p>
            <ul className="space-y-3 mb-8 z-10 text-indigo-100">
              <li className="flex items-center gap-2 font-medium"><CheckCircle className="h-5 w-5 text-purple-400" /> Detailed learning steps</li>
              <li className="flex items-center gap-2 font-medium"><CheckCircle className="h-5 w-5 text-purple-400" /> Recommended projects</li>
              <li className="flex items-center gap-2 font-medium"><CheckCircle className="h-5 w-5 text-purple-400" /> Technology stack selection</li>
            </ul>
            <Link href="/study/career-guidance" className="z-10 mt-auto">
              <Button size="lg" variant="secondary" className="w-full text-lg h-14 rounded-xl bg-white text-indigo-900 hover:bg-gray-100">Generate Roadmap</Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
