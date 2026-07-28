"use client";

import CustomRequirementsForm from "@/components/CustomRequirementsForm";

export default function CustomRequirementsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          Request a <span className="text-primary">Custom Project</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Can't find what you're looking for? Tell us your exact requirements, and our experts will build it from scratch.
        </p>
      </div>
      <CustomRequirementsForm />
    </div>
  );
}
