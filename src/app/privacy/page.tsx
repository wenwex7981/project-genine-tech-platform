import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl text-zinc-300">
      <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
      <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">1. Information We Collect</h2>
          <p>When you visit GraduateNex or make a purchase, we collect certain information including your name, email address, phone number, and IP address. We use Razorpay for payment processing and do not store your credit card or bank details directly on our servers.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Process transactions and deliver your digital products securely.</li>
            <li>Send order confirmations and customer support emails.</li>
            <li>Improve our website, services, and AI tool accuracy.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">3. Third-Party Services</h2>
          <p>We use third-party services like Google Analytics to understand website traffic, and Razorpay for secure payments. These services have their own privacy policies governing the data they collect.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">4. Data Security</h2>
          <p>We implement industry-standard security measures (including HTTPS encryption) to protect your personal information. However, no electronic transmission is 100% secure.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">5. Contact Us</h2>
          <p>If you have questions about our Privacy Policy, please contact us at:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email: support@graduatenex.online</li>
            <li>Address: T Hub, Hitech City, Hyderabad, Telangana, India</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
