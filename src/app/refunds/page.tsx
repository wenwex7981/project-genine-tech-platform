"use client";
import React, { useState } from 'react';
import { RotateCcw, ChevronRight, Mail, Phone, MapPin, AlertTriangle, Clock, CreditCard, FileText, CheckCircle, XCircle, HelpCircle, Globe, Shield } from 'lucide-react';
import Link from 'next/link';

const sections = [
  { id: "overview", label: "Overview" },
  { id: "digital", label: "Digital Products" },
  { id: "custom", label: "Customized Projects" },
  { id: "ai-tools", label: "AI Tools & Services" },
  { id: "technical", label: "Technical Failures" },
  { id: "non-refundable", label: "Non-Refundable Cases" },
  { id: "cancellation", label: "Cancellation Policy" },
  { id: "process", label: "How to Request" },
  { id: "timeline", label: "Refund Timeline" },
  { id: "disputes", label: "Disputes" },
  { id: "contact", label: "Contact Us" },
];

export default function RefundsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pt-24 pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-primary/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="flex items-center gap-3 text-emerald-400 mb-4">
            <RotateCcw className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-widest">Returns & Refunds</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Refund & Cancellation Policy</h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            We want you to have a great experience. This policy outlines when and how refunds are processed for GraduateNex products and services.
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${activeSection === s.id ? "bg-emerald-500/10 text-emerald-400 font-semibold border-l-2 border-emerald-400" : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"}`}>
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
                  <Link href="/delivery" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-primary transition-colors"><Globe className="h-4 w-4" /> Delivery Policy</Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="prose prose-invert prose-zinc max-w-none">

              <section id="overview" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><RotateCcw className="h-5 w-5 text-emerald-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">1. Overview</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>At GraduateNex, customer satisfaction is our priority. Due to the digital nature of our products, refund eligibility varies by product type. This policy applies to all purchases made through <a href="https://graduatenex.online" className="text-primary hover:underline">graduatenex.online</a>.</p>
                  <div className="grid md:grid-cols-3 gap-3 mt-4">
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-white">Eligible</p>
                      <p className="text-xs text-zinc-400 mt-1">Technical failures, undelivered products</p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                      <HelpCircle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-white">Case-by-Case</p>
                      <p className="text-xs text-zinc-400 mt-1">Custom projects, partial completion</p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
                      <XCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                      <p className="text-sm font-bold text-white">Not Eligible</p>
                      <p className="text-xs text-zinc-400 mt-1">Delivered digital products, used services</p>
                    </div>
                  </div>
                </div>
              </section>

              <section id="digital" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><FileText className="h-5 w-5 text-emerald-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">2. Digital Products (Source Code, Documentation, Templates)</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>Digital products including source code packages, documentation templates, IEEE papers, SRS documents, and PPT templates are <strong className="text-white">non-refundable once delivered</strong>, due to the irrecoverable nature of digital goods.</p>
                  <p>Refunds may be considered if:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> The delivered product is substantially different from the description on the Platform.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> Critical files are missing or corrupt, and we are unable to provide a replacement within 48 hours.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> Duplicate payment was charged for the same order.</li>
                  </ul>
                </div>
              </section>

              <section id="custom" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><CreditCard className="h-5 w-5 text-emerald-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">3. Customized Final Year Projects</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>Custom projects are built to your specific requirements and involve dedicated development time. The following refund rules apply:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-700">
                          <th className="text-left py-3 px-4 text-white font-semibold">Scenario</th>
                          <th className="text-left py-3 px-4 text-white font-semibold">Refund Eligibility</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { scenario: "Cancellation before work begins (within 24 hours)", refund: "Full refund (100%)" },
                          { scenario: "Cancellation after work has commenced", refund: "Partial refund based on work completed (reviewed case-by-case)" },
                          { scenario: "Project delivered but does not meet agreed specifications", refund: "Free revisions first; refund if unresolved after 2 revision cycles" },
                          { scenario: "Project delivered and accepted by user", refund: "Non-refundable" },
                          { scenario: "GraduateNex fails to deliver within agreed timeframe", refund: "Full refund (100%)" },
                        ].map((r) => (
                          <tr key={r.scenario} className="border-b border-zinc-800/50">
                            <td className="py-3 px-4 text-zinc-300">{r.scenario}</td>
                            <td className="py-3 px-4 font-medium text-white">{r.refund}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section id="ai-tools" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><HelpCircle className="h-5 w-5 text-emerald-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">4. AI Tools & Services</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>AI-generated outputs (resumes, abstracts, documentation, PPTs) are delivered instantly and are <strong className="text-white">non-refundable</strong> once generated, as the service has been fully rendered.</p>
                  <p>If the AI tool produces an error or fails to generate output entirely (e.g., server error, timeout), you will be eligible for a full refund or a free re-generation of the output.</p>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-amber-400 text-sm font-medium flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>AI outputs are assistive in nature and may require user review and modification. Dissatisfaction with AI-generated content quality does not qualify for a refund, as AI outputs inherently vary.</span>
                    </p>
                  </div>
                </div>
              </section>

              <section id="technical" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-emerald-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">5. Technical Payment Failures</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>If your account is debited but the order is not processed due to a technical failure (network error, gateway timeout, system crash), the following applies:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> <strong className="text-white">Automatic Refund:</strong> Razorpay will automatically initiate a refund within 5–7 business days.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> <strong className="text-white">Manual Escalation:</strong> If the refund is not reflected within 10 business days, contact us with your Razorpay Payment ID for immediate resolution.</li>
                    <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> <strong className="text-white">Duplicate Charges:</strong> If you were charged multiple times for the same order, all duplicate charges will be refunded in full.</li>
                  </ul>
                </div>
              </section>

              <section id="non-refundable" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><XCircle className="h-5 w-5 text-red-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">6. Non-Refundable Cases</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>Refunds will <strong className="text-white">not</strong> be issued in the following circumstances:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><XCircle className="h-4 w-4 text-red-400 mt-1 shrink-0" /> Digital product has been successfully delivered and downloaded.</li>
                    <li className="flex items-start gap-2"><XCircle className="h-4 w-4 text-red-400 mt-1 shrink-0" /> AI tool service has been rendered (output generated).</li>
                    <li className="flex items-start gap-2"><XCircle className="h-4 w-4 text-red-400 mt-1 shrink-0" /> Change of mind after purchase or order completion.</li>
                    <li className="flex items-start gap-2"><XCircle className="h-4 w-4 text-red-400 mt-1 shrink-0" /> User fails to provide accurate requirements for custom projects.</li>
                    <li className="flex items-start gap-2"><XCircle className="h-4 w-4 text-red-400 mt-1 shrink-0" /> Refund request submitted more than 7 days after delivery.</li>
                    <li className="flex items-start gap-2"><XCircle className="h-4 w-4 text-red-400 mt-1 shrink-0" /> Product was used for its intended purpose before requesting a refund.</li>
                  </ul>
                </div>
              </section>

              <section id="cancellation" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><XCircle className="h-5 w-5 text-emerald-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">7. Cancellation Policy</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> <strong className="text-white">Instant Download Products:</strong> Cannot be cancelled as delivery is immediate and automatic.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> <strong className="text-white">Custom Project Orders:</strong> Cancellations must be requested within 24 hours of payment, provided development work has not already commenced.</li>
                    <li className="flex items-start gap-2"><ChevronRight className="h-4 w-4 text-emerald-400 mt-1 shrink-0" /> <strong className="text-white">Subscription Services:</strong> If applicable, subscriptions may be cancelled at any time. No refunds for the current billing period.</li>
                  </ul>
                </div>
              </section>

              <section id="process" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Mail className="h-5 w-5 text-emerald-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">8. How to Request a Refund</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>To request a refund, please email us at <a href="mailto:support@graduatenex.online" className="text-primary hover:underline">support@graduatenex.online</a> with the following details:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Your registered email address",
                      "Order ID / Razorpay Payment ID",
                      "Product or service name",
                      "Reason for refund request",
                      "Screenshots (if applicable)",
                      "Date of purchase",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 p-3 rounded-lg bg-zinc-800/30 text-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-zinc-500">We will acknowledge your request within 24 hours and provide a resolution within 5–7 business days.</p>
                </div>
              </section>

              <section id="timeline" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Clock className="h-5 w-5 text-emerald-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">9. Refund Processing Timeline</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>Once a refund is approved, processing times depend on your payment method:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-700">
                          <th className="text-left py-3 px-4 text-white font-semibold">Payment Method</th>
                          <th className="text-left py-3 px-4 text-white font-semibold">Refund Timeline</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { method: "UPI (Google Pay, PhonePe, etc.)", timeline: "1–3 business days" },
                          { method: "Debit Card", timeline: "5–7 business days" },
                          { method: "Credit Card", timeline: "5–10 business days" },
                          { method: "Net Banking", timeline: "5–7 business days" },
                          { method: "Wallet (Paytm, etc.)", timeline: "1–3 business days" },
                        ].map((r) => (
                          <tr key={r.method} className="border-b border-zinc-800/50">
                            <td className="py-3 px-4 text-zinc-300">{r.method}</td>
                            <td className="py-3 px-4 font-medium text-emerald-400">{r.timeline}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-zinc-500">Timelines are estimates and may vary depending on your bank or payment provider.</p>
                </div>
              </section>

              <section id="disputes" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><HelpCircle className="h-5 w-5 text-emerald-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">10. Disputes & Escalations</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 text-zinc-300 leading-relaxed">
                  <p>If you are unsatisfied with our resolution, you may escalate the matter by contacting us at <a href="mailto:projectgenie16@gmail.com" className="text-primary hover:underline">projectgenie16@gmail.com</a> with the subject line &quot;Refund Dispute – [Your Order ID]&quot;.</p>
                  <p>All disputes shall be governed by the laws of India and subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana.</p>
                </div>
              </section>

              <section id="contact" className="mb-12 scroll-mt-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center"><Mail className="h-5 w-5 text-emerald-400" /></div>
                  <h2 className="text-2xl font-bold text-white m-0">11. Contact Us</h2>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-zinc-300 leading-relaxed">
                  <p className="mb-6">For any refund or cancellation inquiries:</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50">
                      <Mail className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Email</p>
                        <p className="text-sm text-white">support@graduatenex.online</p>
                        <p className="text-sm text-zinc-400">projectgenie16@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50">
                      <Phone className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Phone</p>
                        <p className="text-sm text-white">+91 7981994870</p>
                        <p className="text-xs text-zinc-500 mt-1">Mon–Fri, 9AM–6PM IST</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/50">
                      <MapPin className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
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
