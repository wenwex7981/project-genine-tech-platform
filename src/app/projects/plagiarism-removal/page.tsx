"use client";
import CustomRequirementsForm from "@/components/CustomRequirementsForm";

export default function PlagiarismRemovalPage() {
  return (
    <div className="py-20 bg-background">
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Plagiarism Removal Service</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">We will carefully edit and paraphrase your documents to ensure originality and proper citation.</p>
      </div>
      <CustomRequirementsForm />
    </div>
  );
}
