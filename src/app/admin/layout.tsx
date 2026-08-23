"use client";

import Link from "next/link";
import { LayoutDashboard, ListTodo, FolderGit2, FileText, ArrowLeft, PenTool, Activity } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      setError("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("adminAuth", "true");
      }
    } else {
      setError("Invalid master password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-muted/20">
        <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-950 border rounded-2xl shadow-xl">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Site
          </Link>
          <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
          <p className="text-muted-foreground mb-8">Enter your master password to access the control panel.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Master Password"
                className="w-full p-4 border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary/50"
              />
              {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold">Secure Login</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/40 border-t mt-1">
      <aside className="w-64 border-r bg-background hidden md:block">
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link href="/admin" className="flex items-center p-2 text-foreground rounded-lg hover:bg-muted group">
                <LayoutDashboard className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/projects" className="flex items-center p-2 text-foreground rounded-lg hover:bg-muted group">
                <FolderGit2 className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Manage Projects</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/requests" className="flex items-center p-2 text-foreground rounded-lg hover:bg-muted group">
                <ListTodo className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">All Requests</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/resumes" className="flex items-center p-2 text-foreground rounded-lg hover:bg-muted group">
                <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Resume Templates</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/study" className="flex items-center p-2 text-foreground rounded-lg hover:bg-muted group">
                <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">Interview Prep</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/blog" className="flex items-center p-2 text-foreground rounded-lg hover:bg-muted group">
                <PenTool className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">SEO Blog Manager</span>
              </Link>
            </li>
            <li>
              <Link href="/admin/ai-usage" className="flex items-center p-2 text-foreground rounded-lg hover:bg-muted group">
                <Activity className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="ml-3">AI Usage Metrics</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
