"use client";
import CustomRequirementsForm from "@/components/CustomRequirementsForm";

export default function SourceCodePage() {
  return (
    <div className="py-20 bg-background">
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Request Project Source Code</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Fill out the requirements below to get fully deployable, high-quality source code for your mini or major project.</p>
      </div>
      <CustomRequirementsForm />
    </div>
  );
}
