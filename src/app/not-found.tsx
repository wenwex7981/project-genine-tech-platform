import Link from "next/link";
import { Home, Search, BookOpen, FileText, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
          404
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us help you find what you need.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link href="/projects" className="flex items-center gap-2 p-4 rounded-xl border hover:border-indigo-500/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all text-sm font-medium">
            <BookOpen className="h-5 w-5 text-indigo-500" />
            Browse Projects
          </Link>
          <Link href="/resume" className="flex items-center gap-2 p-4 rounded-xl border hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all text-sm font-medium">
            <FileText className="h-5 w-5 text-emerald-500" />
            Resume Hub
          </Link>
          <Link href="/services" className="flex items-center gap-2 p-4 rounded-xl border hover:border-orange-500/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all text-sm font-medium">
            <GraduationCap className="h-5 w-5 text-orange-500" />
            Our Services
          </Link>
          <Link href="/blog" className="flex items-center gap-2 p-4 rounded-xl border hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all text-sm font-medium">
            <Search className="h-5 w-5 text-violet-500" />
            Read Blog
          </Link>
        </div>

        <Link href="/">
          <Button size="lg" className="font-bold">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
