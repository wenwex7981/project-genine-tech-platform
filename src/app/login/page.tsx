"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Mail, Phone, Lock, KeyRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/home");
      }
    });

    // Listen for login events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/home");
      }
    });
    
    // Initialize RecaptchaVerifier for Firebase Phone Auth
    if (typeof window !== "undefined") {
      import("firebase/auth").then(({ RecaptchaVerifier }) => {
        import("@/lib/firebase").then(({ auth }) => {
          if (!(window as any).recaptchaVerifier) {
            try {
              (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
              });
            } catch (e) {
              console.error("Recaptcha init error", e);
            }
          }
        });
      });
    }

    return () => subscription.unsubscribe();
  }, [router]);

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

  const handleEmailAuth = async (isSignUp: boolean) => {
    if (!email || !password) return alert("Please enter email and password");
    setIsLoading(true);
    try {
      const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("Sign Up successful via Firebase!");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      const idToken = await userCredential.user.getIdToken();
      // Like phone auth, this is a Firebase token.
      console.log("Firebase ID Token:", idToken);
      
      router.push("/home");
      
    } catch (error: any) {
      alert("Firebase Email Auth Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone) return alert("Please enter your phone number with country code (e.g. +91...)");
    
    // Format to strict E.164 format (e.g. +919876543210)
    let formattedPhone = phone.replace(/[\s\-()]/g, ""); // Remove spaces, dashes, parentheses
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    setIsLoading(true);
    try {
      const { signInWithPhoneNumber } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      
      setConfirmationResult(confirmation);
      setIsOtpSent(true);
      alert("OTP sent to your phone! Please check your messages.");
    } catch (error: any) {
      alert("Failed to send OTP via Firebase: " + error.message);
      // Reset recaptcha if failed
      if ((window as any).recaptchaVerifier) {
         (window as any).recaptchaVerifier.render().then((widgetId: any) => {
           (window as any).grecaptcha.reset(widgetId);
         });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Please enter the OTP");
    if (!confirmationResult) return alert("No OTP session found. Please request a new OTP.");
    
    setIsLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      // IMPORTANT: The user is now logged into Firebase, NOT Supabase natively!
      // You must use this `idToken` to make authenticated requests to your Supabase Postgres database.
      // E.g., setting global headers for the Supabase client:
      // supabase.rest.headers['Authorization'] = `Bearer ${idToken}`;
      
      alert("Phone login successful via Firebase! Note: You need to pass the Firebase Token to Supabase manually to access the database.");
      console.log("Firebase ID Token:", idToken);
      
      // Redirect to home
      router.push("/home");
      
    } catch (error: any) {
      alert("Failed to verify OTP: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FFFDFB] font-sans">
      {/* Left Column - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col p-8 lg:p-12 xl:p-16 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-8 lg:mb-12 transition-opacity hover:opacity-80">
          <div className="relative h-9 w-9 rounded-md overflow-hidden">
            <Image src="/logo.png" alt="GraduateNex Logo" fill className="object-cover" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#1C1917]">GraduateNex</span>
        </Link>

        {/* Content */}
        <div className="max-w-[420px] w-full mx-auto flex-1 flex flex-col justify-center pb-20">
          <h1 className="text-3xl lg:text-4xl font-serif text-[#1C1917] tracking-tight mb-3">
            Welcome back
          </h1>
          <p className="text-base text-[#57534E] mb-8 font-medium">
            Sign in to continue your academic journey.
          </p>

          <div className="bg-white rounded-[2rem] border border-[#E7E5E4] p-8 shadow-sm">
            
            {/* Method Toggle */}
            <div className="flex p-1 bg-[#F5F5F4] rounded-xl mb-6">
              <button 
                onClick={() => { setLoginMethod("email"); setIsOtpSent(false); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${loginMethod === "email" ? "bg-white text-[#1C1917] shadow-sm" : "text-[#78716C] hover:text-[#1C1917]"}`}
              >
                Email
              </button>
              <button 
                onClick={() => setLoginMethod("phone")}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${loginMethod === "phone" ? "bg-white text-[#1C1917] shadow-sm" : "text-[#78716C] hover:text-[#1C1917]"}`}
              >
                Phone
              </button>
            </div>

            {/* Email Flow */}
            {loginMethod === "email" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1C1917]">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-[#A8A29E]" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-all bg-[#FAFAFA]"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1C1917]">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-[#A8A29E]" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-all bg-[#FAFAFA]"
                    />
                  </div>
                </div>
                
                <div className="pt-2 flex gap-3">
                  <Button 
                    onClick={() => handleEmailAuth(false)} 
                    disabled={isLoading}
                    className="flex-1 h-12 text-sm font-semibold bg-[#1C1917] text-white hover:bg-[#292524] rounded-xl"
                  >
                    Log In
                  </Button>
                  <Button 
                    onClick={() => handleEmailAuth(true)} 
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 h-12 text-sm font-semibold rounded-xl border-[#E7E5E4] hover:bg-[#F5F5F4]"
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            )}

            {/* Phone Flow */}
            {loginMethod === "phone" && (
              <div className="space-y-4">
                {!isOtpSent ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#1C1917]">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-[#A8A29E]" />
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-all bg-[#FAFAFA]"
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button 
                        onClick={handleSendOtp} 
                        disabled={isLoading}
                        className="w-full h-12 text-sm font-semibold bg-[#1C1917] text-white hover:bg-[#292524] rounded-xl"
                      >
                        Send OTP
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#1C1917]">Enter OTP</label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-3 h-5 w-5 text-[#A8A29E]" />
                        <input 
                          type="text" 
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="123456"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E7E5E4] focus:outline-none focus:ring-2 focus:ring-[#1C1917]/20 focus:border-[#1C1917] transition-all bg-[#FAFAFA]"
                        />
                      </div>
                    </div>
                    <div className="pt-2 flex gap-3">
                      <Button 
                        onClick={handleVerifyOtp} 
                        disabled={isLoading}
                        className="flex-1 h-12 text-sm font-semibold bg-[#1C1917] text-white hover:bg-[#292524] rounded-xl"
                      >
                        Verify & Login
                      </Button>
                      <Button 
                        onClick={() => setIsOtpSent(false)} 
                        disabled={isLoading}
                        variant="outline"
                        className="h-12 px-4 text-sm font-semibold rounded-xl border-[#E7E5E4] hover:bg-[#F5F5F4]"
                      >
                        Back
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E7E5E4]" />
              </div>
              <div className="relative flex justify-center text-[11px] font-bold tracking-wider uppercase">
                <span className="bg-white px-3 text-[#A8A29E]">Or continue with</span>
              </div>
            </div>

            <Button 
              onClick={handleGoogleLogin} 
              disabled={isLoading}
              variant="outline" 
              className="w-full h-12 text-base font-semibold shadow-none hover:bg-[#F5F5F4] transition-all flex items-center justify-center gap-3 rounded-xl border-[#E7E5E4]"
            >
              {isLoading ? (
                 <span className="animate-pulse text-[#57534E]">Connecting...</span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-[#1C1917]">Google</span>
                </>
              )}
            </Button>
            
          </div>
          
          <div className="mt-8 flex justify-center">
             <Link href="/" className="inline-flex items-center text-sm font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors bg-white px-5 py-2.5 rounded-xl border border-[#E7E5E4] shadow-sm hover:shadow-md">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Website
            </Link>
          </div>
          
          {/* Always mount recaptcha-container to avoid auth/argument-error */}
          <div id="recaptcha-container"></div>
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
