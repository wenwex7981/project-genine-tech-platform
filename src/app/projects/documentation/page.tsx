"use client";
import CustomRequirementsForm from "@/components/CustomRequirementsForm";

export default function DocumentationPage() {
  return (
    <div className="py-20 bg-background">
      <div className="container mx-auto px-4 text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Request Documentation & SRS</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">Need a professional IEEE format report or an SRS manual? Submit your requirements below.</p>
      </div>
      <CustomRequirementsForm />
    </div>
  );
}
