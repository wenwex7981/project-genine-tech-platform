"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewResumeTemplatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "", price: "", description: ""
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  const handleUpload = async (file: File | null, folder: string) => {
    if (!file) return null;
    const form = new FormData();
    form.append('file', file);
    form.append('folder', folder);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) {
      console.error("Upload failed", await res.text());
      return null;
    }
    const data = await res.json();
    return data.url || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Upload files to R2
      const image_url = await handleUpload(imageFile, 'resume-thumbnails');
      const file_url = await handleUpload(docFile, 'resume-templates');

      // 2. Insert into Supabase
      const { error } = await supabase.from('resume_templates').insert([{
        title: formData.title,
        price: formData.price,
        description: formData.description,
        image_url,
        file_url
      }]);

      if (error) throw error;
      router.push('/admin/resumes');
    } catch (error) {
      console.error(error);
      alert("Error adding template. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-8">Add New Resume Template</h1>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border">
        
        <div className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Template Title</label>
            <input required type="text" className="w-full p-2.5 border rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Modern ATS Friendly Resume" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Price</label>
            <input required type="text" className="w-full p-2.5 border rounded-lg" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. ₹299" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Detailed Description</label>
            <textarea required className="w-full p-2.5 border rounded-lg min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe what makes this template great..." />
          </div>
        </div>

        <div className="border-t pt-8 space-y-6">
          <h2 className="text-xl font-bold">Cloudflare R2 Media Uploads</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border p-4 rounded-xl space-y-2 bg-muted/20">
              <label className="font-semibold text-sm">Thumbnail Preview Image</label>
              <input required type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            </div>
            
            <div className="border p-4 rounded-xl space-y-2 bg-muted/20">
              <label className="font-semibold text-sm">Actual Template Document (DOCX/PDF)</label>
              <input required type="file" onChange={(e) => setDocFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Uploading & Saving...</> : <><Save className="mr-2 h-5 w-5" /> Save Resume Template</>}
        </Button>
      </form>
    </div>
  );
}
