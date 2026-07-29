"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewInterviewPrepPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "", company_name: "", price: "", description: ""
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
      const image_url = await handleUpload(imageFile, 'study-thumbnails');
      const file_url = await handleUpload(docFile, 'study-docs');

      if (!file_url) throw new Error("Document PDF is required");

      // 2. Insert into Supabase
      const { error } = await supabase.from('interview_prep_docs').insert([{
        title: formData.title,
        company_name: formData.company_name,
        price: formData.price,
        description: formData.description,
        image_url,
        file_url
      }]);

      if (error) throw error;
      router.push('/admin/study');
    } catch (error) {
      console.error(error);
      alert("Error adding document. Make sure PDF is uploaded.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add Interview Prep Document</h1>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm space-y-6">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Company Name (e.g. Google, Deloitte)</label>
            <input required value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Document Title</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Price (₹)</label>
          <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div className="grid grid-cols-2 gap-6 p-4 border rounded-xl bg-gray-50/50">
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">Thumbnail Image (Optional)</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-emerald-600">Document PDF (Required)</label>
            <input required type="file" accept=".pdf,.doc,.docx" onChange={e => setDocFile(e.target.files?.[0] || null)} className="w-full text-sm" />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-bold">
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
          {isSubmitting ? "Uploading Document..." : "Save Document"}
        </Button>
      </form>
    </div>
  );
}
