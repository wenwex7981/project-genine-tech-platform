import React from 'react';

export default function DeliveryPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl text-zinc-300">
      <h1 className="text-4xl font-bold mb-8 text-white">Delivery & Shipping Policy</h1>
      <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">1. Digital Delivery</h2>
          <p>GraduateNex provides strictly digital products and services. No physical items will be shipped to your address.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">2. Delivery Timelines</h2>
          <ul className="list-disc pl-6 mt-2 space-y-3">
            <li><strong>AI Resume & Document Generation:</strong> Delivered instantly upon successful payment via digital download or email link.</li>
            <li><strong>Pre-made Source Code Projects:</strong> Instant download immediately after payment confirmation.</li>
            <li><strong>Customized Final Year Projects:</strong> Delivery times vary based on complexity, typically ranging between 2 to 7 business days as mutually agreed upon prior to checkout.</li>
            <li><strong>Research Paper Assistance:</strong> Timelines will be communicated directly by our experts, generally within 3-10 business days depending on the scope.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">3. Access Issues</h2>
          <p>If you experience any technical difficulties accessing your downloaded products or do not receive your confirmation email within 30 minutes of payment, please contact our support team immediately.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">4. Contact Information</h2>
          <p>For any delivery-related inquiries:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email: support@graduatenex.online</li>
            <li>Phone: +91 7981994870</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
