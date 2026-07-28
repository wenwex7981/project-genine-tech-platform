"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditResumeTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "", price: "", description: ""
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [existingDoc, setExistingDoc] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const { data, error } = await supabase.from('resume_templates').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) {
          setFormData({
            title: data.title,
            price: data.price,
            description: data.description
          });
          setExistingImage(data.image_url);
          setExistingDoc(data.file_url);
        }
      } catch (error) {
        console.error("Error fetching template:", error);
        alert("Template not found.");
        router.push('/admin/resumes');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTemplate();
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
      const image_url = imageFile ? await handleUpload(imageFile, 'resume-thumbnails') : existingImage;
      const file_url = docFile ? await handleUpload(docFile, 'resume-templates') : existingDoc;

      const { error } = await supabase.from('resume_templates').update({
        title: formData.title,
        price: formData.price,
        description: formData.description,
        image_url,
        file_url
      }).eq('id', id);

      if (error) throw error;
      router.push('/admin/resumes');
    } catch (error) {
      console.error(error);
      alert("Error updating template. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-8">Edit Resume Template</h1>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border">
        
        <div className="grid gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Template Title</label>
            <input required type="text" className="w-full p-2.5 border rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Price</label>
            <input required type="text" className="w-full p-2.5 border rounded-lg" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Detailed Description</label>
            <textarea required className="w-full p-2.5 border rounded-lg min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
        </div>

        <div className="border-t pt-8 space-y-6">
          <h2 className="text-xl font-bold">Update Media (Optional)</h2>
          <p className="text-muted-foreground text-sm">Leave empty to keep existing media.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border p-4 rounded-xl space-y-2 bg-muted/20">
              <label className="font-semibold text-sm">Thumbnail Preview Image</label>
              {existingImage && <p className="text-xs text-green-600 mb-2">Current: Uploaded</p>}
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            </div>
            
            <div className="border p-4 rounded-xl space-y-2 bg-muted/20">
              <label className="font-semibold text-sm">Actual Template Document</label>
              {existingDoc && <p className="text-xs text-green-600 mb-2">Current: Uploaded</p>}
              <input type="file" onChange={(e) => setDocFile(e.target.files?.[0] || null)} className="w-full text-xs" />
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Changes...</> : <><Save className="mr-2 h-5 w-5" /> Save Changes</>}
        </Button>
      </form>
    </div>
  );
}
