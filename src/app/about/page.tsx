import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, Zap, Shield, GraduationCap, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 bg-zinc-950 overflow-hidden border-b text-white">
        <div className="absolute inset-0 z-0">
          <Image src="/hero_bg.png" alt="About Hero" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Empowering the Next Generation of <span className="text-primary">Innovators</span></h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-8 font-light">
            GraduateNex is revolutionizing academic success by providing premium, end-to-end project solutions for students across India.
          </p>
          <Link href="/projects">
            <Button size="lg" className="h-14 px-8 text-lg font-bold">Explore Our Work</Button>
          </Link>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                At GraduateNex, we believe that academic projects shouldn't be a source of stress, but a stepping stone to a successful career. Our mission is to bridge the gap between academic requirements and industry standards.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We provide meticulously crafted source code, zero-plagiarism documentation, and premium AI services to ensure B.Tech, M.Tech, BCA, MCA, and MBA students score top grades while actually understanding the technology they deploy.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-muted/50 p-6 rounded-2xl border">
                <Target className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Precision</h3>
                <p className="text-sm text-muted-foreground">Every project is built to precise academic rubrics.</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-2xl border">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Originality</h3>
                <p className="text-sm text-muted-foreground">Guaranteed 100% plagiarism-free documentation.</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-2xl border">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-sm text-muted-foreground">Integrating the latest AI, ML, and Blockchain tech.</p>
              </div>
              <div className="bg-muted/50 p-6 rounded-2xl border">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Support</h3>
                <p className="text-sm text-muted-foreground">24/7 dedicated technical support for execution.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership / Founder */}
      <section className="py-20 bg-muted/20 border-y">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-16">Leadership</h2>
          
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border shadow-xl p-8 md:p-12 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
              <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full overflow-hidden border-4 border-primary/20 relative shadow-2xl">
                <Image src="/founder_nithin.jpg" alt="Appala Nithin" fill className="object-cover object-top" />
              </div>
              
              <div>
                <h3 className="text-3xl font-black mb-2">Appala Nithin</h3>
                <p className="text-primary font-bold tracking-widest uppercase text-sm mb-6">Founder & CEO</p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  "I started GraduateNex with a simple goal: to democratize access to high-quality academic software. Too many talented students struggle with complex setups, outdated documentation, and plagiarism flags. We are here to change that narrative."
                </p>
                <div className="flex gap-4">
                  <span className="flex items-center text-sm font-semibold text-muted-foreground"><GraduationCap className="h-5 w-5 mr-2 text-primary" /> Visionary</span>
                  <span className="flex items-center text-sm font-semibold text-muted-foreground"><Award className="h-5 w-5 mr-2 text-primary" /> Technologist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Ace Your Academics?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of students who have secured top grades and dream jobs using our premium projects and resumes.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/projects">
              <Button size="lg" className="h-14 px-8 text-lg font-bold">Browse Marketplace</Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold">View AI Services</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
