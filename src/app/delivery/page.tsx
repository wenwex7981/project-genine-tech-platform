"use client";
import React, { useState } from 'react';
import { Truck, ChevronRight, Mail, Phone, MapPin, Clock, Zap, Package, Globe, FileText, Shield, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import Link from 'next/link';

const sections = [
  { id: "overview", label: "Overview" },
  { id: "digital-delivery", label: "Digital Delivery" },
  { id: "timelines", label: "Delivery Timelines" },
  { id: "instant", label: "Instant Download Products" },
  { id: "custom", label: "Custom Project Delivery" },
  { id: "email", label: "Email Delivery" },
  { id: "access", label: "Access Issues" },
  { id: "shipping", label: "Physical Shipping" },
  { id: "contact", label: "Contact Us" },
];

export default function DeliveryPage() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pt-24 pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-primary/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="flex items-center gap-3 text-violet-400 mb-4">
            <Truck className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Shipping & Delivery</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Delivery & Shipping Policy</h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            GraduateNex provides exclusively digital products and services. This policy explains how and when your purchases are delivered.
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${activeSection === s.id ? "bg-violet-500/10 text-violet-400 font-semibold border-l-2 border-violet-400" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"}`}>
                    <ChevronRight className={`h-3 w-3 transition-transform ${activeSection === s.id ? "rotate-90" : ""}`} />
                    {s.label}
                  </a>
                ))}
              </nav>
              <div className="mt-8 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-sm font-bold text-white mb-3">Related Policies</h4>
                <div className="space-y-2">
                  <Link href="/terms" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-primary transition-colors"><FileText className="h-4 w-4" /> Terms & Conditions</Link>
                  <Link href="/privacy" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-primary transition-colors"><Shield className="h-4 w-4" /> Privacy Policy</Link>
                  <Link href="/refunds" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-primary transition-colors"><FileText className="h-4 w-4" /> Refund Policy</Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-invert prose-zinc max-w-none">

              <section id="overview" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><Globe className="h-5 w-5 text-violet-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">1. Overview</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>GraduateNex is a <strong className="text-white">100% digital platform</strong>. All products and services are delivered electronically via download links, email, or direct access through your GraduateNex dashboard. <strong className="text-white">No physical items are shipped.</strong></p>
                  <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                    <p className="text-violet-400 text-sm font-medium flex items-start gap-2">
                      <Zap className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Most products are delivered instantly after payment confirmation. Custom projects follow a separate timeline communicated prior to checkout.</span>
                    </p>
                  </div>
                </div>
              </section>

              <section id="digital-delivery" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><Download className="h-5 w-5 text-violet-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">2. Digital Delivery Methods</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>Depending on the product type, delivery is performed through one or more of the following channels:</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-zinc-800/30 text-center">
                      <Download className="h-8 w-8 text-violet-400 mx-auto mb-3" />
                      <p className="font-bold text-white text-sm">Direct Download</p>
                      <p className="text-xs text-zinc-400 mt-1">Immediate download link provided on the order confirmation page</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-800/30 text-center">
                      <Mail className="h-8 w-8 text-violet-400 mx-auto mb-3" />
                      <p className="font-bold text-white text-sm">Email Delivery</p>
                      <p className="text-xs text-zinc-400 mt-1">Secure download link sent to your registered email address</p>
                    </div>
                    <div className="p-4 rounded-xl bg-zinc-800/30 text-center">
                      <Globe className="h-8 w-8 text-violet-400 mx-auto mb-3" />
                      <p className="font-bold text-white text-sm">Dashboard Access</p>
                      <p className="text-xs text-zinc-400 mt-1">AI tool outputs available directly in your GraduateNex dashboard</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="timelines" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><Clock className="h-5 w-5 text-violet-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">3. Delivery Timelines</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-700">
                          <th className="text-left py-3 px-4 text-white font-semibold">Product / Service</th>
                          <th className="text-left py-3 px-4 text-white font-semibold">Delivery Method</th>
                          <th className="text-left py-3 px-4 text-white font-semibold">Expected Timeline</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { product: "AI Resume Generator", method: "Dashboard / Download", timeline: "Instant (within seconds)" },
                          { product: "ATS Resume Checker", method: "Dashboard", timeline: "Instant (within seconds)" },
                          { product: "JD Match Analyzer", method: "Dashboard", timeline: "Instant (within seconds)" },
                          { product: "AI PPT Generator", method: "Download", timeline: "Instant (within seconds)" },
                          { product: "AI Documentation Generator", method: "Download", timeline: "Instant (within seconds)" },
                          { product: "Pre-made Source Code", method: "Download + Email", timeline: "Instant after payment" },
                          { product: "Documentation Templates", method: "Download + Email", timeline: "Instant after payment" },
                          { product: "Customized Final Year Projects", method: "Email + Dashboard", timeline: "2–7 business days" },
                          { product: "Research Paper Assistance", method: "Email", timeline: "3–10 business days" },
                          { product: "Plagiarism Removal Service", method: "Email", timeline: "1–3 business days" },
                        ].map((r) => (
                          <tr key={r.product} className="border-b border-zinc-800/50">
                            <td className="py-3 px-4 text-zinc-300 font-medium">{r.product}</td>
                            <td className="py-3 px-4 text-zinc-400">{r.method}</td>
                            <td className="py-3 px-4 font-semibold text-violet-400">{r.timeline}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-zinc-500">Timelines for custom projects are estimates and may vary based on complexity. Exact delivery dates are confirmed before payment.</p>
                </div>
              </section>

              <section id="instant" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><Zap className="h-5 w-5 text-violet-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">4. Instant Download Products</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>For products marked as &quot;Instant Download&quot;:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-violet-400 mt-1 shrink-0" /> A secure download link is generated automatically upon successful payment confirmation from Razorpay.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-violet-400 mt-1 shrink-0" /> The download link is displayed on the order confirmation page and sent to your registered email.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-violet-400 mt-1 shrink-0" /> Download links remain active for 72 hours. If you need an extension, contact our support team.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-violet-400 mt-1 shrink-0" /> Files are delivered in standard formats (.zip, .pdf, .docx, .pptx) compatible with all major operating systems.</li>
                  </ul>
                </div>
              </section>

              <section id="custom" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><Package className="h-5 w-5 text-violet-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">5. Custom Project Delivery</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>Customized final year projects follow a structured delivery process:</p>
                  <div className="space-y-4">
                    {[
                      { step: "1", title: "Requirement Confirmation", desc: "We review your project requirements and confirm specifications within 24 hours of payment." },
                      { step: "2", title: "Development Phase", desc: "Our team develops your project according to agreed specifications. You may receive progress updates via email." },
                      { step: "3", title: "Quality Assurance", desc: "Completed project undergoes internal quality check, plagiarism screening, and testing before delivery." },
                      { step: "4", title: "Delivery", desc: "Complete project package (source code, documentation, PPT, deployment guide) is delivered via secure download link." },
                      { step: "5", title: "Support", desc: "Post-delivery support is provided for setup, deployment, and viva preparation as per your plan." },
                    ].map((s) => (
                      <div key={s.step} className="flex gap-4 p-4 rounded-xl bg-zinc-800/30">
                        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-black text-sm shrink-0">{s.step}</div>
                        <div>
                          <p className="font-semibold text-white">{s.title}</p>
                          <p className="text-sm text-zinc-400 mt-1">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section id="email" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><Mail className="h-5 w-5 text-violet-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">6. Email Delivery</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>Order confirmations and delivery emails are sent from <strong className="text-white">support@graduatenex.online</strong>. Please ensure this address is whitelisted in your email settings to avoid delivery issues.</p>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-amber-400 text-sm font-medium flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Please check your spam/junk folder if you do not receive your order confirmation within 15 minutes of payment. If still not found, contact us immediately.</span>
                    </p>
                  </div>
                </div>
              </section>

              <section id="access" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-violet-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">7. Access Issues & Troubleshooting</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>If you experience any issues accessing your purchased products:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-violet-400 mt-1 shrink-0" /> Check your email spam/junk folder for the delivery email.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-violet-400 mt-1 shrink-0" /> Ensure you are logged into the same account used for purchase.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-violet-400 mt-1 shrink-0" /> Try a different browser or disable ad blockers that may interfere with downloads.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-violet-400 mt-1 shrink-0" /> Contact our support team with your Order ID for immediate assistance.</li>
                  </ul>
                  <p>Our support team is available <strong className="text-white">Monday to Friday, 9AM–6PM IST</strong> and aims to resolve all delivery issues within 24 hours.</p>
                </div>
              </section>

              <section id="shipping" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><Truck className="h-5 w-5 text-violet-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">8. Physical Shipping</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>GraduateNex is a <strong className="text-white">digital-only platform</strong>. We do not sell, ship, or deliver any physical goods. All products and services are delivered electronically as described above.</p>
                  <p>No shipping charges, delivery fees, or logistics costs are applicable to any order placed on GraduateNex.</p>
                </div>
              </section>

              <section id="contact" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center"><Mail className="h-5 w-5 text-violet-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">9. Contact Us</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-zinc-300 leading-relaxed">
                  <p className="mb-6">For any delivery-related concerns or to report a missing order:</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50">
                      <Mail className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Email</p>
                        <p className="text-sm text-white">support@graduatenex.online</p>
                        <p className="text-sm text-zinc-400">projectgenie16@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50">
                      <Phone className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Phone</p>
                        <p className="text-sm text-white">+91 7981994870</p>
                        <p className="text-xs text-zinc-500 mt-1">Mon–Fri, 9AM–6PM IST</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50">
                      <MapPin className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
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
