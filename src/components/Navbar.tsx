"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Lock, X, ShoppingCart, Menu, UserCircle, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { totalItems } = useCart();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

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

  const isAdmin = 
    user?.email === 'proejctgenie16@gmail.com' || 
    user?.email === 'projectgenie16@gmail.com' ||
    user?.email === 'nithinpatel2025@gmail.com';

  const NavLinks = () => (
    <>
      <Link href="/projects" onClick={() => setIsMobileMenuOpen(false)} className="whitespace-nowrap text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
        Projects
      </Link>
      <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="whitespace-nowrap text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
        Services
      </Link>
      <Link href="/resume" onClick={() => setIsMobileMenuOpen(false)} className="whitespace-nowrap text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
        Resume Hub
      </Link>
      <Link href="/hackathons" onClick={() => setIsMobileMenuOpen(false)} className="whitespace-nowrap text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
        Hackathons
      </Link>

      <Link href="/study" onClick={() => setIsMobileMenuOpen(false)} className="whitespace-nowrap text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
        Study Hub
      </Link>
      <Link href="/ai-services" onClick={() => setIsMobileMenuOpen(false)} className="whitespace-nowrap text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
        AI Tools
      </Link>
      <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="whitespace-nowrap text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
        Pricing
      </Link>
      <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="whitespace-nowrap text-sm font-medium text-foreground/80 transition-colors hover:text-primary">
        Blog
      </Link>
      {user && (
        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-primary transition-colors hover:text-primary/80 flex items-center gap-1 border-l pl-4 border-muted">
          <UserCircle className="w-4 h-4" /> My Dashboard
        </Link>
      )}
      {isAdmin && (
        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-bold text-red-500 transition-colors hover:text-red-400 flex items-center gap-1 border-l pl-4 border-muted">
          <Lock className="w-4 h-4" /> Admin
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6 justify-between gap-4">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105 z-50">
          <div className="relative h-10 w-10 overflow-hidden rounded-md">
            <Image src="/logo.png" alt="GraduateNex Logo" fill className="object-cover" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-foreground sm:inline-block">
            GraduateNex
          </span>
        </Link>
        
        {/* Center/Desktop Nav */}
        <nav className="hidden lg:flex gap-3 xl:gap-5 items-center">
          <NavLinks />
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 z-50">
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
            ) : (
              <>
                <button onClick={() => setShowLoginModal(true)} className="p-2 hover:bg-muted rounded-full transition-colors" title="Admin Login">
                  <Lock className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </button>
                <Link href="/login"><Button variant="outline">Sign In</Button></Link>
                <Link href="/login"><Button className="font-bold">Get Started Free</Button></Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 hover:bg-muted rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-xl animate-in slide-in-from-top-2 p-6 flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            <NavLinks />
          </nav>
          
          <div className="flex flex-col gap-3 pt-4 border-t">
            {user ? (
              <Button variant="outline" onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="w-full">Sign Out</Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full font-bold">Get Started Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

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
