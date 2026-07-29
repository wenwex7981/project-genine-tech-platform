import React from 'react';

export default function RefundsPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl text-zinc-300">
      <h1 className="text-4xl font-bold mb-8 text-white">Refund & Cancellation Policy</h1>
      <p className="mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">1. Digital Products</h2>
          <p>Digital products (including source code, documentation, AI-generated resumes, and PPTs) are generally non-refundable once delivered, due to the irrecoverable nature of digital goods.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">2. Customized Projects</h2>
          <p>Customized projects may have specific revision policies depending on the scope of work agreed upon prior to payment. If you are unsatisfied with a custom project, please contact us for revisions. Full refunds on custom projects are only issued if we fail to deliver the agreed-upon initial requirements.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">3. Technical Failures</h2>
          <p>Technical payment failures (where your account is debited but the order is not processed) will be refunded automatically by our payment gateway, Razorpay, within 5-7 business days.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">4. Cancellations</h2>
          <p>For immediate download products, cancellations are not applicable as the product is delivered instantly. For customized project orders, cancellations must be requested within 24 hours of payment, provided work has not already commenced.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-white">5. How to Request a Refund</h2>
          <p>If you believe you are eligible for a refund based on these terms, please contact us:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Email: support@graduatenex.online</li>
            <li>Phone: +91 7981994870</li>
          </ul>
          <p className="mt-2">Please include your Order ID and Razorpay Payment ID in your request.</p>
        </section>
      </div>
    </div>
  );
}
