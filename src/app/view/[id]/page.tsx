"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { use } from "react";
import { Button } from "@/components/ui/button";

export default function DocumentViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [doc, setDoc] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDocument() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // 1. Check if user owns this item
        let userOwns = false;
        
        if (session?.user) {
          const { data: orders } = await supabase
            .from('orders')
            .select('items')
            .eq('user_email', session.user.email);
            
          (orders || []).forEach((order: any) => {
            (order.items || []).forEach((item: any) => {
              if (String(item.id) === String(id)) {
                userOwns = true;
              }
            });
          });
        }
        
        // Let admins view anything
        const isAdmin = session?.user?.email === "admin@graduatenex.online"; // Add any admin emails or flags here if needed
        if (isAdmin) userOwns = true;
        
        setHasAccess(userOwns);

        if (!userOwns) {
           setIsLoading(false);
           return;
        }

        // 2. Fetch document data (check interview prep first, then projects, then resumes)
        let foundDoc = null;
        
        const { data: interviewDoc } = await supabase.from('interview_prep_docs').select('*').eq('id', id).single();
        if (interviewDoc) {
           foundDoc = { ...interviewDoc, docType: 'interview' };
        } else {
           const { data: projectDoc } = await supabase.from('projects').select('*').eq('id', id).single();
           if (projectDoc) {
             foundDoc = { ...projectDoc, docType: 'project' };
           } else {
             const { data: resumeDoc } = await supabase.from('resume_templates').select('*').eq('id', id).single();
             if (resumeDoc) foundDoc = { ...resumeDoc, docType: 'resume' };
           }
        }
        
        setDoc(foundDoc);
      } catch (err) {
        console.error("Error loading document:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDocument();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Decrypting and loading document...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] px-4 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-extrabold mb-4">Access Denied</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          You do not have permission to view this document. If you recently purchased it, please make sure you are logged in with the same email used for the purchase.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="font-bold px-8">Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh]">
        <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
        <p className="text-muted-foreground mb-8">This document may have been removed or the link is invalid.</p>
        <Link href="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground flex items-center gap-2 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="font-bold text-sm bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-full">
              {doc.company_name || "Premium Document"}
            </div>
            {doc.docType && (
              <Link href={`/admin/${doc.docType === 'resume' ? 'resumes' : doc.docType === 'project' ? 'projects' : 'study'}/${doc.id}/edit`}>
                <Button variant="outline" size="sm" className="hidden sm:flex border-blue-200 text-blue-600 hover:bg-blue-50">
                  Edit Document
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Document Content */}
      <div className={`container mx-auto px-4 py-8 ${doc.docType === 'resume' ? 'max-w-5xl' : 'max-w-4xl'}`}>
        <div className={`bg-white dark:bg-zinc-900 shadow-sm border ${doc.docType === 'resume' ? 'rounded-sm p-10 md:p-16 min-h-[1122px] shadow-lg print:shadow-none print:border-none' : 'rounded-2xl p-8 md:p-12'}`}>
          <h1 className={`font-extrabold mb-6 pb-6 border-b text-gray-900 dark:text-white ${doc.docType === 'resume' ? 'text-4xl text-center uppercase tracking-wider' : 'text-3xl md:text-4xl'}`}>
            {doc.title}
          </h1>
          
          <div className={
            doc.docType === 'resume' 
              ? "prose prose-sm md:prose-base dark:prose-invert max-w-none text-left prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-widest prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:border-b-2 prose-h2:border-gray-800 dark:prose-h2:border-gray-200 prose-h2:pb-1 prose-p:my-1 prose-ul:my-1 prose-li:my-0" 
              : "prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:border-b prose-h2:pb-2 prose-indigo text-left"
          }>
            <ReactMarkdown>
              {doc.description || "*No content available for this document.*"}
            </ReactMarkdown>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
          <p>© {new Date().getFullYear()} GraduateNex. This premium document is licensed to you for personal use only.</p>
        </div>
      </div>
    </div>
  );
}
