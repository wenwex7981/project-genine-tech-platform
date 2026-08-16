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
          redirectTo: `${window.location.origin}/home`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      alert("Error logging in: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FFFDFB] font-sans">
      {/* Left Column - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col p-8 lg:p-12 xl:p-16 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-16 lg:mb-24 transition-opacity hover:opacity-80">
          <div className="relative h-9 w-9 rounded-md overflow-hidden">
            <Image src="/logo.png" alt="GraduateNex Logo" fill className="object-cover" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#1C1917]">GraduateNex</span>
        </Link>

        {/* Content */}
        <div className="max-w-[420px] w-full mx-auto flex-1 flex flex-col justify-center pb-20">
          <h1 className="text-4xl lg:text-5xl font-serif text-[#1C1917] tracking-tight mb-4 leading-tight">
            Elevate your academic journey
          </h1>
          <p className="text-lg text-[#57534E] mb-10 font-medium">
            Your intelligence partner for big ambitions.
          </p>

          <div className="bg-white rounded-[2rem] border border-[#E7E5E4] p-8 lg:p-10 shadow-sm">
            <Button 
              onClick={handleGoogleLogin} 
              disabled={isLoading}
              variant="outline" 
              size="lg" 
              className="w-full h-14 text-base font-semibold shadow-none hover:bg-[#F5F5F4] transition-all flex items-center justify-center gap-3 rounded-xl border-[#E7E5E4]"
            >
              {isLoading ? (
                 <span className="animate-pulse text-[#57534E]">Connecting to Google...</span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-[#1C1917]">Continue with Google</span>
                </>
              )}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E7E5E4]" />
              </div>
              <div className="relative flex justify-center text-[11px] font-bold tracking-wider uppercase">
                <span className="bg-white px-3 text-[#A8A29E]">Or</span>
              </div>
            </div>

            <Button 
              disabled={true}
              variant="outline" 
              size="lg" 
              className="w-full h-14 text-base font-semibold shadow-none bg-[#1C1917] text-white hover:bg-[#292524] transition-all rounded-xl border-transparent"
            >
              Continue with email
            </Button>
            
          </div>
          
          <div className="mt-8 flex justify-center">
             <Link href="/" className="inline-flex items-center text-sm font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors bg-white px-5 py-2.5 rounded-xl border border-[#E7E5E4] shadow-sm hover:shadow-md">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Website
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden md:block md:w-1/2 p-4 lg:p-6 pl-0">
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl bg-[#E7E5E4]">
          <Image 
            src="/images/login-bg.png" 
            alt="Student studying with big ambitions" 
            fill 
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
