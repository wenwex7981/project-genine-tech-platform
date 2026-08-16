"use client";
import React, { useState } from 'react';
import { Shield, ChevronRight, Mail, Phone, MapPin, Scale, FileText, AlertTriangle, Users, Globe, Lock, BookOpen } from 'lucide-react';
import Link from 'next/link';

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "definitions", label: "Definitions" },
  { id: "eligibility", label: "Eligibility" },
  { id: "account", label: "Account & Registration" },
  { id: "services", label: "Services Offered" },
  { id: "pricing", label: "Pricing & Payments" },
  { id: "ip", label: "Intellectual Property" },
  { id: "usage", label: "Acceptable Use" },
  { id: "disclaimer", label: "Disclaimer" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "indemnity", label: "Indemnification" },
  { id: "termination", label: "Termination" },
  { id: "governing", label: "Governing Law" },
  { id: "changes", label: "Changes to Terms" },
  { id: "contact", label: "Contact Us" },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("intro");

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pt-24 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-blue-500/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="flex items-center gap-3 text-primary mb-4">
            <Scale className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Legal</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Terms and Conditions</h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            Please read these terms carefully before using GraduateNex. By accessing or using our platform, you agree to be bound by these terms.
          </p>
          <div className="flex items-center gap-6 mt-6 text-sm text-zinc-500">
            <span>Effective Date: July 29, 2026</span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span>Last Updated: July 29, 2026</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
          
          {/* Sidebar Navigation */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 px-3">Table of Contents</h3>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                      activeSection === s.id
                        ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    <ChevronRight className={`h-3 w-3 transition-transform ${activeSection === s.id ? "rotate-90" : ""}`} />
                    {s.label}
                  </a>
                ))}
              </nav>

              {/* Quick Links */}
              <div className="mt-8 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-sm font-bold text-white mb-3">Related Policies</h4>
                <div className="space-y-2">
                  <Link href="/privacy" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-primary transition-colors">
                    <Shield className="h-4 w-4" /> Privacy Policy
                  </Link>
                  <Link href="/refunds" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-primary transition-colors">
                    <FileText className="h-4 w-4" /> Refund Policy
                  </Link>
                  <Link href="/delivery" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-primary transition-colors">
                    <Globe className="h-4 w-4" /> Delivery Policy
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-invert prose-zinc max-w-none">

              <section id="intro" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">1. Introduction</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>Welcome to <strong className="text-white">GraduateNex</strong> (accessible at <a href="https://www.graduatenex.online" className="text-primary hover:underline">graduatenex.online</a>), operated by GraduateNex, headquartered at T Hub, Hitech City, Hyderabad, Telangana, India.</p>
                  <p>These Terms and Conditions (&quot;Terms&quot;, &quot;Agreement&quot;) govern your access to and use of the GraduateNex website, mobile applications, and all related services (collectively, the &quot;Platform&quot;). By creating an account, placing an order, or otherwise using our Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms.</p>
                  <p>If you do not agree with any part of these Terms, you must immediately discontinue use of the Platform.</p>
                </div>
              </section>

              <section id="definitions" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">2. Definitions</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-3 text-zinc-300 leading-relaxed">
                  <div className="grid gap-3">
                    {[
                      { term: '"Platform"', def: "Refers to the GraduateNex website, applications, APIs, and all associated services." },
                      { term: '"User" / "You"', def: "Any individual who accesses, browses, or uses the Platform." },
                      { term: '"Services"', def: "All digital products and services offered through GraduateNex, including but not limited to source code, documentation, AI tools, resume services, and research assistance." },
                      { term: '"Content"', def: "All text, images, code, documents, and other materials available on or through the Platform." },
                      { term: '"Order"', def: "A confirmed purchase of one or more Services through the Platform." },
                    ].map((item) => (
                      <div key={item.term} className="flex gap-3 p-3 rounded-xl bg-zinc-800/30">
                        <span className="font-semibold text-white shrink-0 min-w-[140px]">{item.term}</span>
                        <span className="text-zinc-400">{item.def}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="eligibility" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">3. Eligibility</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>You must be at least <strong className="text-white">18 years of age</strong> or the age of legal majority in your jurisdiction to use this Platform. By using GraduateNex, you represent and warrant that:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-primary mt-1 shrink-0" /> You have the legal capacity to enter into a binding agreement.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-primary mt-1 shrink-0" /> You will use the Platform in compliance with all applicable laws and regulations.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-primary mt-1 shrink-0" /> All information you provide during registration or checkout is accurate and complete.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-primary mt-1 shrink-0" /> You are not barred from using the Platform under any applicable law.</li>
                  </ul>
                </div>
              </section>

              <section id="account" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">4. Account & Registration</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>To access certain features of the Platform, you may be required to create an account using Google Sign-In or email registration. You are responsible for:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-primary mt-1 shrink-0" /> Maintaining the confidentiality of your account credentials.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-primary mt-1 shrink-0" /> All activities that occur under your account.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-primary mt-1 shrink-0" /> Notifying us immediately of any unauthorized access or use of your account.</li>
                  </ul>
                  <p>GraduateNex reserves the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.</p>
                </div>
              </section>

              <section id="services" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">5. Services Offered</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>GraduateNex provides the following digital services and products designed to assist students and professionals:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Final Year Project Source Code",
                      "Project Documentation (SRS, IEEE Papers)",
                      "AI-Powered Resume Generator",
                      "ATS Resume Compatibility Checker",
                      "JD Match Analyzer",
                      "AI PPT Generator",
                      "Research Paper Assistance",
                      "Plagiarism Removal Tools",
                    ].map((s) => (
                      <div key={s} className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/30 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-amber-400 text-sm font-medium flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>All services are intended as <strong>educational aids and assistive tools</strong>. GraduateNex does not guarantee academic grades, university approvals, placement offers, or specific employment outcomes. Users are solely responsible for the ethical use of all materials.</span>
                    </p>
                  </div>
                </div>
              </section>

              <section id="pricing" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">6. Pricing & Payments</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>All prices are listed in <strong className="text-white">Indian Rupees (INR)</strong> and are inclusive of applicable taxes unless otherwise stated. Payments are processed securely through <strong className="text-white">Razorpay</strong>, a PCI-DSS compliant payment gateway. We support UPI, Debit/Credit Cards, Net Banking, and Wallets.</p>
                  <p>GraduateNex reserves the right to modify pricing at any time. Price changes will not affect orders already confirmed and paid for.</p>
                  <p>We do not store your payment card details on our servers. All payment data is handled exclusively by Razorpay in accordance with their <a href="https://razorpay.com/privacy/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">privacy policy</a>.</p>
                </div>
              </section>

              <section id="ip" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">7. Intellectual Property</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>All content, trademarks, logos, UI design, source code templates, documentation, and other intellectual property displayed on the Platform are owned by or licensed to GraduateNex and are protected under applicable intellectual property laws.</p>
                  <p>Upon successful purchase, you are granted a <strong className="text-white">non-exclusive, non-transferable, personal-use license</strong> to use the purchased digital products for your own educational or professional needs. You may <strong className="text-white">not</strong>:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-red-400 mt-1 shrink-0" /> Resell, redistribute, or sublicense any purchased product.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-red-400 mt-1 shrink-0" /> Upload purchased content to public repositories or file-sharing platforms.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-red-400 mt-1 shrink-0" /> Remove copyright notices or attribution from any materials.</li>
                  </ul>
                </div>
              </section>

              <section id="usage" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">8. Acceptable Use Policy</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>You agree not to use the Platform to:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-red-400 mt-1 shrink-0" /> Engage in any unlawful, fraudulent, or harmful activity.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-red-400 mt-1 shrink-0" /> Attempt to gain unauthorized access to systems, networks, or data.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-red-400 mt-1 shrink-0" /> Distribute malware, viruses, or other harmful software.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-red-400 mt-1 shrink-0" /> Scrape, crawl, or harvest data from the Platform without written consent.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-red-400 mt-1 shrink-0" /> Impersonate another person or misrepresent your affiliation.</li>
                  </ul>
                  <p>Violation of this policy may result in immediate account suspension and legal action.</p>
                </div>
              </section>

              <section id="disclaimer" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">9. Disclaimer of Warranties</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>The Platform and all Services are provided on an <strong className="text-white">&quot;AS IS&quot;</strong> and <strong className="text-white">&quot;AS AVAILABLE&quot;</strong> basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
                  <p>GraduateNex does not warrant that the Platform will be uninterrupted, error-free, or completely secure. AI-generated content is provided as an assistive output and may require user review and modification.</p>
                </div>
              </section>

              <section id="liability" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">10. Limitation of Liability</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>To the maximum extent permitted by applicable law, GraduateNex and its directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, revenue, or profits, arising out of or in connection with your use of the Platform.</p>
                  <p>Our total aggregate liability for any claim arising out of these Terms shall not exceed the total amount paid by you to GraduateNex in the <strong className="text-white">twelve (12) months</strong> preceding the claim.</p>
                </div>
              </section>

              <section id="indemnity" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">11. Indemnification</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>You agree to indemnify, defend, and hold harmless GraduateNex, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or related to your use of the Platform, violation of these Terms, or infringement of any third-party rights.</p>
                </div>
              </section>

              <section id="termination" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">12. Termination</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>GraduateNex reserves the right to suspend or terminate your account and access to the Platform at any time, with or without cause or notice, including for violation of these Terms. Upon termination, your right to use the Platform ceases immediately. Provisions of these Terms that by their nature should survive termination shall survive.</p>
                </div>
              </section>

              <section id="governing" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">13. Governing Law & Jurisdiction</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>These Terms shall be governed by and construed in accordance with the laws of <strong className="text-white">India</strong>. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in <strong className="text-white">Hyderabad, Telangana, India</strong>.</p>
                </div>
              </section>

              <section id="changes" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">14. Changes to These Terms</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>GraduateNex reserves the right to update or modify these Terms at any time. Material changes will be communicated via email or a prominent notice on the Platform. Your continued use of the Platform after such changes constitutes your acceptance of the revised Terms.</p>
                  <p>We encourage you to review this page periodically for the latest information.</p>
                </div>
              </section>

              <section id="contact" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white m-0">15. Contact Us</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-zinc-300 leading-relaxed">
                  <p className="mb-6">If you have any questions, concerns, or requests regarding these Terms, please contact us using the information below:</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50">
                      <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Email</p>
                        <p className="text-sm text-white">support@graduatenex.online</p>
                        <p className="text-sm text-zinc-400">projectgenie16@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50">
                      <Phone className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Phone</p>
                        <p className="text-sm text-white">+91 7981994870</p>
                        <p className="text-xs text-zinc-500 mt-1">Mon–Fri, 9AM–6PM IST</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Address</p>
                        <p className="text-sm text-white">T Hub, Hitech City</p>
                        <p className="text-sm text-zinc-400">Hyderabad, Telangana, India</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
