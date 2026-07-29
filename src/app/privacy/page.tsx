"use client";
import React, { useState } from 'react';
import { Shield, ChevronRight, Mail, Phone, MapPin, Lock, Eye, Database, Cookie, UserCheck, Globe, Server, Bell, FileText } from 'lucide-react';
import Link from 'next/link';

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "collect", label: "Information We Collect" },
  { id: "usage", label: "How We Use Your Data" },
  { id: "sharing", label: "Data Sharing & Disclosure" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "thirdparty", label: "Third-Party Services" },
  { id: "security", label: "Data Security" },
  { id: "retention", label: "Data Retention" },
  { id: "rights", label: "Your Rights" },
  { id: "children", label: "Children's Privacy" },
  { id: "changes", label: "Policy Changes" },
  { id: "contact", label: "Contact Us" },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("intro");

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pt-24 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-primary/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="flex items-center gap-3 text-blue-400 mb-4">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Privacy & Data Protection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            Your privacy matters to us. This policy explains how GraduateNex collects, uses, stores, and protects your personal information.
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

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 px-3">Table of Contents</h3>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${activeSection === s.id ? "bg-blue-500/10 text-blue-400 font-semibold border-l-2 border-blue-400" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"}`}>
                    <ChevronRight className={`h-3 w-3 transition-transform ${activeSection === s.id ? "rotate-90" : ""}`} />
                    {s.label}
                  </a>
                ))}
              </nav>
              <div className="mt-8 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-sm font-bold text-white mb-3">Related Policies</h4>
                <div className="space-y-2">
                  <Link href="/terms" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-primary transition-colors"><FileText className="h-4 w-4" /> Terms & Conditions</Link>
                  <Link href="/refunds" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-primary transition-colors"><FileText className="h-4 w-4" /> Refund Policy</Link>
                  <Link href="/delivery" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-primary transition-colors"><Globe className="h-4 w-4" /> Delivery Policy</Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-invert prose-zinc max-w-none">

              <section id="intro" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Shield className="h-5 w-5 text-blue-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">1. Introduction</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>GraduateNex (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your personal data and respecting your privacy. This Privacy Policy describes the types of information we collect when you visit <a href="https://graduatenex.online" className="text-primary hover:underline">graduatenex.online</a>, how we use and safeguard that information, and your rights regarding your personal data.</p>
                  <p>By using our Platform, you consent to the collection and use of information in accordance with this policy. If you do not agree with this policy, please do not use our services.</p>
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-blue-400 text-sm font-medium flex items-start gap-2">
                      <Lock className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>GraduateNex uses industry-standard encryption (HTTPS/TLS) and partners with PCI-DSS compliant payment processors to protect your data.</span>
                    </p>
                  </div>
                </div>
              </section>

              <section id="collect" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Database className="h-5 w-5 text-blue-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">2. Information We Collect</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6 text-zinc-300 leading-relaxed">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">2.1 Information You Provide Directly</h3>
                    <div className="grid gap-3">
                      {[
                        { label: "Account Information", desc: "Name, email address, profile picture (via Google Sign-In)." },
                        { label: "Order Information", desc: "Products purchased, transaction amount, payment method selected." },
                        { label: "Contact Form Data", desc: "Name, email, phone number, and message content when you reach out to us." },
                        { label: "Uploaded Documents", desc: "Resumes, project requirements, or other files you submit for processing by our AI tools." },
                      ].map((item) => (
                        <div key={item.label} className="flex gap-3 p-3 rounded-xl bg-zinc-800/30">
                          <span className="font-semibold text-white shrink-0 min-w-[180px]">{item.label}</span>
                          <span className="text-zinc-400">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">2.2 Information Collected Automatically</h3>
                    <div className="grid gap-3">
                      {[
                        { label: "Device Information", desc: "Browser type, operating system, screen resolution, and device identifiers." },
                        { label: "Usage Data", desc: "Pages visited, time spent on pages, click patterns, and referral URLs." },
                        { label: "IP Address", desc: "Your Internet Protocol address, used for analytics and security purposes." },
                        { label: "Cookies", desc: "Small data files stored on your device to enhance your experience (see Section 5)." },
                      ].map((item) => (
                        <div key={item.label} className="flex gap-3 p-3 rounded-xl bg-zinc-800/30">
                          <span className="font-semibold text-white shrink-0 min-w-[180px]">{item.label}</span>
                          <span className="text-zinc-400">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section id="usage" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Eye className="h-5 w-5 text-blue-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">3. How We Use Your Data</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>We use the information we collect for the following purposes:</p>
                  <ul className="space-y-2">
                    {[
                      "To process and fulfill your orders and deliver digital products.",
                      "To send transactional emails (order confirmations, receipts, delivery links).",
                      "To provide customer support and respond to your inquiries.",
                      "To personalize your experience and recommend relevant services.",
                      "To improve our Platform, AI tools, and service quality.",
                      "To detect, prevent, and address fraud, abuse, or technical issues.",
                      "To comply with legal obligations and enforce our Terms of Service.",
                      "To send promotional communications (only with your explicit consent, and you may opt out at any time).",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-blue-400 mt-1 shrink-0" /> {item}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <section id="sharing" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Globe className="h-5 w-5 text-blue-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">4. Data Sharing & Disclosure</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p><strong className="text-white">We do not sell, rent, or trade your personal information to third parties.</strong> We may share your data only in the following circumstances:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-blue-400 mt-1 shrink-0" /><span><strong className="text-white">Payment Processors:</strong> Razorpay processes your payment data under their own privacy policy. We do not store card details.</span></li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-blue-400 mt-1 shrink-0" /><span><strong className="text-white">Analytics Providers:</strong> Google Analytics collects anonymized usage data to help us improve the Platform.</span></li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-blue-400 mt-1 shrink-0" /><span><strong className="text-white">Authentication Providers:</strong> Google Sign-In and Supabase Auth manage your login credentials.</span></li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-blue-400 mt-1 shrink-0" /><span><strong className="text-white">Legal Requirements:</strong> When required by law, court order, or governmental authority.</span></li>
                  </ul>
                </div>
              </section>

              <section id="cookies" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Cookie className="h-5 w-5 text-blue-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">5. Cookies & Tracking Technologies</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>We use cookies and similar tracking technologies to enhance your browsing experience. The types of cookies we use include:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-700">
                          <th className="text-left py-3 px-4 text-white font-semibold">Cookie Type</th>
                          <th className="text-left py-3 px-4 text-white font-semibold">Purpose</th>
                          <th className="text-left py-3 px-4 text-white font-semibold">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { type: "Essential", purpose: "Authentication, security, and session management", duration: "Session" },
                          { type: "Analytics", purpose: "Understanding user behaviour and improving services", duration: "Up to 2 years" },
                          { type: "Functional", purpose: "Remembering your preferences and settings", duration: "1 year" },
                        ].map((c) => (
                          <tr key={c.type} className="border-b border-zinc-800/50">
                            <td className="py-3 px-4 font-medium text-white">{c.type}</td>
                            <td className="py-3 px-4 text-zinc-400">{c.purpose}</td>
                            <td className="py-3 px-4 text-zinc-400">{c.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-zinc-500">You can manage cookie preferences through your browser settings. Disabling essential cookies may affect Platform functionality.</p>
                </div>
              </section>

              <section id="thirdparty" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Server className="h-5 w-5 text-blue-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">6. Third-Party Services</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>We integrate with the following third-party services, each governed by their own privacy policies:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { name: "Razorpay", desc: "Payment processing" },
                      { name: "Google Analytics", desc: "Website analytics" },
                      { name: "Google Sign-In", desc: "User authentication" },
                      { name: "Supabase", desc: "Database & authentication" },
                      { name: "Cloudflare R2", desc: "File storage & CDN" },
                      { name: "Vercel", desc: "Website hosting" },
                    ].map((s) => (
                      <div key={s.name} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/30">
                        <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                        <span><strong className="text-white">{s.name}</strong> — {s.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="security" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Lock className="h-5 w-5 text-blue-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">7. Data Security</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>We implement industry-standard security measures to protect your personal information, including:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> <strong className="text-white">HTTPS/TLS Encryption</strong> for all data transmitted between your browser and our servers.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> <strong className="text-white">PCI-DSS Compliant</strong> payment processing through Razorpay (we never store card data).</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> <strong className="text-white">Secure Authentication</strong> via OAuth 2.0 (Google Sign-In) and Supabase Auth.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> <strong className="text-white">Regular Security Audits</strong> and monitoring for unauthorized access attempts.</li>
                  </ul>
                  <p className="text-sm text-zinc-500">While we strive to protect your data, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security.</p>
                </div>
              </section>

              <section id="retention" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Database className="h-5 w-5 text-blue-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">8. Data Retention</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, including:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-blue-400 mt-1 shrink-0" /> <strong className="text-white">Account Data:</strong> Retained for the lifetime of your account. Deleted within 30 days of account deletion request.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-blue-400 mt-1 shrink-0" /> <strong className="text-white">Transaction Records:</strong> Retained for up to 7 years as required by Indian tax and accounting regulations.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-blue-400 mt-1 shrink-0" /> <strong className="text-white">Uploaded Documents:</strong> Processed files (resumes, etc.) are automatically deleted within 24 hours of processing.</li>
                  </ul>
                </div>
              </section>

              <section id="rights" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><UserCheck className="h-5 w-5 text-blue-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">9. Your Rights</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { right: "Right to Access", desc: "Request a copy of your personal data." },
                      { right: "Right to Rectification", desc: "Request correction of inaccurate data." },
                      { right: "Right to Deletion", desc: "Request deletion of your personal data." },
                      { right: "Right to Portability", desc: "Receive your data in a machine-readable format." },
                      { right: "Right to Object", desc: "Object to processing of your data for marketing." },
                      { right: "Right to Withdraw Consent", desc: "Withdraw consent at any time for data processing." },
                    ].map((r) => (
                      <div key={r.right} className="p-3 rounded-xl bg-zinc-800/30">
                        <p className="font-semibold text-white text-sm">{r.right}</p>
                        <p className="text-xs text-zinc-400 mt-1">{r.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm">To exercise any of these rights, please contact us at <a href="mailto:support@graduatenex.online" className="text-primary hover:underline">support@graduatenex.online</a>. We will respond within 30 days.</p>
                </div>
              </section>

              <section id="children" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><UserCheck className="h-5 w-5 text-blue-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">10. Children&apos;s Privacy</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>GraduateNex is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately. We will take steps to delete such information promptly.</p>
                </div>
              </section>

              <section id="changes" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Bell className="h-5 w-5 text-blue-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">11. Changes to This Policy</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make material changes, we will notify you by updating the &quot;Last Updated&quot; date at the top of this page and, where appropriate, sending you an email notification.</p>
                  <p>We encourage you to review this page periodically for the latest information on our privacy practices.</p>
                </div>
              </section>

              <section id="contact" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Mail className="h-5 w-5 text-blue-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">12. Contact Us</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-zinc-300 leading-relaxed">
                  <p className="mb-6">If you have any questions or concerns about this Privacy Policy or our data practices, please reach out to our Data Protection team:</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50">
                      <Mail className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Email</p>
                        <p className="text-sm text-white">support@graduatenex.online</p>
                        <p className="text-sm text-zinc-400">projectgenie16@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50">
                      <Phone className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Phone</p>
                        <p className="text-sm text-white">+91 7981994870</p>
                        <p className="text-xs text-zinc-500 mt-1">Mon–Fri, 9AM–6PM IST</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50">
                      <MapPin className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
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
