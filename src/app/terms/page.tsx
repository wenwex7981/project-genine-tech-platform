import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl text-zinc-300">
      <h1 className="text-4xl font-bold mb-8 text-white">Terms and Conditions</h1>
      <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">1. Introduction</h2>
          <p>Welcome to GraduateNex. By accessing or using our website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use our services.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">2. Services Offered</h2>
          <p>GraduateNex provides academic project source code, documentation assistance, AI-generated resumes, and research paper guidance. Our AI tools and templates are designed for educational and assistive purposes only.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">3. User Responsibilities</h2>
          <p>You agree to use our services and content only for lawful purposes. You are solely responsible for how you utilize the source code, documentation, and resumes generated via our platform. GraduateNex does not guarantee academic grades, university approvals, or specific employment outcomes.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">4. Pricing and Payments</h2>
          <p>All prices are explicitly listed on our service pages. Payments are processed securely via Razorpay. We reserve the right to change our pricing at any time without prior notice.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">5. Intellectual Property</h2>
          <p>All content, tools, and branding on GraduateNex are the intellectual property of GraduateNex. You may not resell or redistribute our digital products without explicit written permission.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">6. Contact Information</h2>
          <p>For any questions regarding these terms, please contact us at:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email: support@graduatenex.online / projectgenie16@gmail.com</li>
            <li>Phone: +91 7981994870</li>
            <li>Address: T Hub, Hitech City, Hyderabad, Telangana, India</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
