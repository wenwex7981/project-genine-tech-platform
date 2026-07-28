"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CustomRequirementsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [abstractFile, setAbstractFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    studyField: "",
    projectType: "",
    daysRequired: "",
    contactNumber: "",
    email: "",
    description: "",
    collegeName: "",
    location: "",
    services: {
      researchPaper: false,
      documentation: false,
      ppt: false,
      resume: false,
      jobProfile: false,
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAbstractFile(e.target.files[0]);
    }
  };

  const handleCheckboxChange = (service: keyof typeof formData.services) => {
    setFormData({
      ...formData,
      services: {
        ...formData.services,
        [service]: !formData.services[service]
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const servicesString = `Research: ${formData.services.researchPaper ? 'Yes' : 'No'}, Docs: ${formData.services.documentation ? 'Yes' : 'No'}, PPT: ${formData.services.ppt ? 'Yes' : 'No'}, Resume: ${formData.services.resume ? 'Yes' : 'No'}, Job Profile: ${formData.services.jobProfile ? 'Yes' : 'No'}`;

    let abstractUrl = "";
    if (abstractFile) {
      const uploadData = new FormData();
      uploadData.append('file', abstractFile);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        if (res.ok) {
          const data = await res.json();
          abstractUrl = data.url;
        }
      } catch (err) {
        console.error("Error uploading abstract:", err);
      }
    }

    // 1. Submit to Supabase
    const { error } = await supabase.from('custom_requirements').insert([{
      title: formData.title,
      study_field: formData.studyField,
      project_type: formData.projectType,
      days_required: formData.daysRequired,
      contact_number: formData.contactNumber,
      email: formData.email,
      description: formData.description,
      college_name: formData.collegeName,
      location: formData.location,
      abstract_url: abstractUrl,
      services: servicesString
    }]);

    if (error) {
      console.error("Error inserting to Supabase:", error);
      alert(`Database Error: ${error.message}. Did you run the SQL migration scripts for the new columns?`);
      setIsSubmitting(false);
      return;
    }

    // 2. Submit to Web3Forms for Email Notification
    try {
      const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      if (web3formsKey) {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: `New Custom Request: ${formData.title}`,
            "Project Title": formData.title,
            "Study Field": formData.studyField,
            "Project Type": formData.projectType,
            "Delivery Time": formData.daysRequired + " days",
            "Contact Number": formData.contactNumber,
            "Email": formData.email,
            "Description": formData.description,
            "College Name": formData.collegeName,
            "Location": formData.location,
            "Abstract Document": abstractUrl || "Not provided",
            "Extra Services": servicesString
          })
        });
      }
    } catch (err) {
      console.error("Error sending email via Web3Forms:", err);
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-zinc-900 border rounded-2xl shadow-lg p-6">
        <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4 text-center">Requirements Submitted!</h2>
        <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">
          We have successfully received your request. Our team will contact you shortly at {formData.email}.
        </p>
        <Button onClick={() => setIsSuccess(false)}>Submit Another Request</Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-2xl shadow-lg p-5 sm:p-6 md:p-10 w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
            <Sparkles className="h-5 w-5 text-primary" /> Basic Details
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Project Title</label>
              <input 
                required name="title" value={formData.title} onChange={handleChange}
                type="text" placeholder="e.g., Smart IoT Agriculture" 
                className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Study Field</label>
              <select 
                required name="studyField" value={formData.studyField} onChange={handleChange}
                className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
              >
                <option value="" disabled>Select field</option>
                <option value="BTech">B.Tech</option>
                <option value="MTech">M.Tech</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                <option value="Degree">Degree (BSc/BCom)</option>
                <option value="MBA">MBA</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Project Type</label>
              <select 
                required name="projectType" value={formData.projectType} onChange={handleChange}
                className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
              >
                <option value="" disabled>Select type</option>
                <option value="Major Project">Major Project</option>
                <option value="Minor Project">Minor Project</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Delivery Time (Days)</label>
              <input 
                required name="daysRequired" value={formData.daysRequired} onChange={handleChange}
                type="number" min="1" placeholder="e.g., 15" 
                className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">College / University</label>
              <input 
                required name="collegeName" value={formData.collegeName} onChange={handleChange}
                type="text" placeholder="e.g., IIT Bombay" 
                className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Location / City</label>
              <input 
                required name="location" value={formData.location} onChange={handleChange}
                type="text" placeholder="e.g., Mumbai" 
                className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
            <Sparkles className="h-5 w-5 text-primary" /> Contact Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Contact Number</label>
              <input 
                required name="contactNumber" value={formData.contactNumber} onChange={handleChange}
                type="tel" placeholder="+91 9876543210" 
                className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email Address</label>
              <input 
                required name="email" value={formData.email} onChange={handleChange}
                type="email" placeholder="student@example.com" 
                className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 outline-none transition-shadow"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
            <Sparkles className="h-5 w-5 text-primary" /> Additional Requirements
          </h2>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold">Upload Abstract / Base Paper (Optional)</label>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full p-2.5 rounded-lg border bg-background text-sm cursor-pointer file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:px-4 file:py-2 file:rounded-md file:mr-4 hover:file:bg-primary/20 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Project Description</label>
            <textarea 
              required name="description" value={formData.description} onChange={handleChange}
              placeholder="Describe your project requirements, tech stack, and any specific features you need..." 
              className="w-full min-h-[120px] p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary/50 outline-none resize-none transition-shadow"
            />
          </div>

          <div className="pt-4">
            <label className="text-sm font-semibold mb-3 block">Looking for any extra services?</label>
            <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
              <label className="flex items-center gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <input 
                  type="checkbox" className="w-5 h-5 accent-primary"
                  checked={formData.services.researchPaper}
                  onChange={() => handleCheckboxChange("researchPaper")}
                />
                <span className="font-medium text-sm sm:text-base">Research Paper</span>
              </label>
              <label className="flex items-center gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <input 
                  type="checkbox" className="w-5 h-5 accent-primary"
                  checked={formData.services.documentation}
                  onChange={() => handleCheckboxChange("documentation")}
                />
                <span className="font-medium text-sm sm:text-base">Documentation</span>
              </label>
              <label className="flex items-center gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <input 
                  type="checkbox" className="w-5 h-5 accent-primary"
                  checked={formData.services.ppt}
                  onChange={() => handleCheckboxChange("ppt")}
                />
                <span className="font-medium text-sm sm:text-base">PPT Making</span>
              </label>
              <label className="flex items-center gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <input 
                  type="checkbox" className="w-5 h-5 accent-primary"
                  checked={formData.services.resume}
                  onChange={() => handleCheckboxChange("resume")}
                />
                <span className="font-medium text-sm sm:text-base">Resume Making</span>
              </label>
              <label className="flex items-center gap-3 p-3 sm:p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                <input 
                  type="checkbox" className="w-5 h-5 accent-primary"
                  checked={formData.services.jobProfile}
                  onChange={() => handleCheckboxChange("jobProfile")}
                />
                <span className="font-medium text-sm sm:text-base">Job Profile Optimization</span>
              </label>
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full h-12 sm:h-14 text-base sm:text-lg mt-6" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : (
            <>
              <Send className="mr-2 h-5 w-5" /> Submit Custom Requirements
            </>
          )}
        </Button>

      </form>
    </div>
  );
}
