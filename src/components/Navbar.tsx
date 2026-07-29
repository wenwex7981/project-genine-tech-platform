"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Lock, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { totalItems } = useCart();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = () => {
    setShowLoginModal(true);
    setPassword("");
    setLoginError("");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "7981@Nithin") {
      setUser({ email: 'projectgenie16@gmail.com' });
      setShowLoginModal(false);
    } else {
      setLoginError("Incorrect password. Please try again.");
    }
  };

  const handleSignOut = async () => {
    setUser(null);
    await supabase.auth.signOut().catch(() => {});
    window.location.href = "/";
  };

  // Check for both the typo version the user provided, and the correct spelling just in case
  const isAdmin = 
    user?.email === 'proejctgenie16@gmail.com' || 
    user?.email === 'projectgenie16@gmail.com' ||
    user?.email === 'nithinpatel2025@gmail.com';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href={user ? "/home" : "/"} className="flex items-center gap-3 transition-transform hover:scale-105">
          <div className="relative h-10 w-10 overflow-hidden rounded-md">
            <Image src="/logo.png" alt="GraduateNex Logo" fill className="object-cover" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-foreground hidden sm:inline-block">
            GraduateNex
          </span>
        </Link>
        {user && (
          <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
            <Link href="/projects" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
              Projects
            </Link>
            <Link href="/services" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
              Services
            </Link>
            <Link href="/resume" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Resume Hub
            </Link>
            <Link href="/hackathons" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              Hackathons
            </Link>
            <Link href="/ai-services" className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI Services
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm font-bold text-primary transition-colors hover:text-primary/80 flex items-center gap-1 ml-2 border-l pl-4 border-muted">
                Admin Dashboard
              </Link>
            )}
          </nav>
        )}
        <div className="ml-auto flex items-center gap-4">
          {!user && (
            <nav className="hidden md:flex items-center gap-6 mr-2">
              <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">About</Link>
              <Link href="/services" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Services</Link>
              <Link href="/contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Contact</Link>
            </nav>
          )}
          {user && (
            <Link href="/cart" className="relative p-2 hover:bg-muted rounded-full transition-colors flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {user ? (
            <Button variant="outline" onClick={handleSignOut} className="hidden sm:inline-flex">Sign Out</Button>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline-block">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button className="font-bold">Get Started Free</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Modern Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Lock className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Admin Access</h2>
              </div>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleLoginSubmit} className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">
                  Master Password
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your admin password"
                  autoFocus
                  className="w-full p-3 border rounded-xl bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                />
                {loginError && (
                  <p className="text-sm text-red-500 font-medium animate-in slide-in-from-top-1">{loginError}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full h-12 text-base font-semibold shadow-md">
                Secure Login
              </Button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
