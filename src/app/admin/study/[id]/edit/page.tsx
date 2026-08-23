"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function EditInterviewPrepPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "", company_name: "", price: "", description: "", file_url: "", image_url: ""
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchDoc() {
      const { data, error } = await supabase.from('interview_prep_docs').select('*').eq('id', id).single();
      if (error) {
        console.error(error);
        alert("Document not found");
        router.push('/admin/study');
        return;
      }
      setFormData({
        title: data.title || "",
        company_name: data.company_name || "",
        price: data.price?.toString() || "199",
        description: data.description || "",
        file_url: data.file_url || "",
        image_url: data.image_url || ""
      });
      setIsLoading(false);
    }
    fetchDoc();
  }, [id, router]);

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
      // 1. Upload new files to R2 if provided
      const newImageUrl = await handleUpload(imageFile, 'study-thumbnails');
      const newFileUrl = await handleUpload(docFile, 'study-docs');

      const finalImageUrl = newImageUrl || formData.image_url;
      let finalFileUrl = newFileUrl || formData.file_url;
      
      // If AI generated 'pending' and they didn't upload a new file, they can manually paste a URL
      if (finalFileUrl === 'pending') {
         // keep it pending or let them edit the input field
      }

      // 2. Update Supabase
      const { error } = await supabase.from('interview_prep_docs').update({
        title: formData.title,
        company_name: formData.company_name,
        price: parseFloat(formData.price),
        description: formData.description,
        image_url: finalImageUrl,
        file_url: finalFileUrl
      }).eq('id', id);

      if (error) throw error;
      router.push('/admin/study');
    } catch (error) {
      console.error(error);
      alert("Error updating document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Interview Prep Document</h1>
      
      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm space-y-6">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Company Name</label>
            <input required value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Document Title</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description (AI Content)</label>
          <textarea required rows={8} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Price (₹)</label>
          <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">File URL / Download Link</label>
          <input value={formData.file_url} onChange={e => setFormData({...formData, file_url: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm" placeholder="Paste URL here or upload below" />
          {formData.file_url === 'pending' && (
             <p className="text-xs text-amber-600 mt-2 font-medium">This document was AI generated and needs a real PDF file. Please upload one below or paste a link.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 p-4 border rounded-xl bg-gray-50/50">
          <div>
            <label className="block text-sm font-semibold mb-2 text-primary">Replace Thumbnail (Optional)</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-emerald-600">Replace Document PDF (Optional)</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={e => setDocFile(e.target.files?.[0] || null)} className="w-full text-sm" />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg font-bold">
          {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
          {isSubmitting ? "Saving Changes..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
