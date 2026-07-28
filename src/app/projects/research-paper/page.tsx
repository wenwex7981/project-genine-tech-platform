"use client";
import CustomRequirementsForm from "@/components/CustomRequirementsForm";

export default function ResearchPaperPage() {
  return (
    <div className="py-20 bg-background">
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Request Research Paper</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">We write high-quality research papers ready for submission to top academic journals.</p>
      </div>
      <CustomRequirementsForm />
    </div>
  );
}
