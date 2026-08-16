"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      alert("Error logging in: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-950 border rounded-[2rem] shadow-2xl relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-xl overflow-hidden mb-6 relative shadow-lg">
          <Image src="/logo.png" alt="Logo" fill className="object-cover" />
        </div>
        
        <h1 className="text-2xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-center mb-8">
          Sign in to GraduateNex to access your premium academic dashboard.
        </p>

        <Button 
          onClick={handleGoogleLogin} 
          disabled={isLoading}
          variant="outline" 
          size="lg" 
          className="w-full h-14 text-lg font-bold shadow-sm hover:bg-muted transition-all flex items-center justify-center gap-3 rounded-xl border-2"
        >
          {isLoading ? (
             <span className="animate-pulse">Connecting to Google...</span>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </>
          )}
        </Button>

        <p className="mt-8 text-xs text-muted-foreground text-center">
          By continuing, you agree to the Terms of Service and Privacy Policy of Takevolet ecosystem.
        </p>

        <Link href="/" className="mt-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Website
        </Link>
      </div>
    </div>
  );
}
