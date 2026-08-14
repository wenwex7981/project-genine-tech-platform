"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Save, X, Image as ImageIcon, Video, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "", type: "Major", education: "BTech", branch: "CSE", sub_domain: "AI/ML", price: "", description: ""
  });
  const [features, setFeatures] = useState("Full Source Code, Database Schema, Execution Guide");
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

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
      const uploadedImages = [];
      for (const file of imageFiles) {
        const url = await handleUpload(file, 'project-images');
        if (url) uploadedImages.push(url);
      }
      
      const image_url = uploadedImages.length > 0 ? uploadedImages[0] : null; // Primary fallback
      const video_url = await handleUpload(videoFile, 'project-videos');
      const pdf_url = await handleUpload(pdfFile, 'project-pdfs');

      // 2. Insert into Supabase
      const { error } = await supabase.from('projects').insert([{
        title: formData.title,
        type: formData.type,
        education: formData.education,
        branch: formData.branch || null,
        sub_domain: formData.sub_domain || null,
        price: formData.price,
        description: formData.description,
        features: features.split(',').map(f => f.trim()).filter(f => f),
        image_url,
        images: uploadedImages, // New JSONB/array column
        video_url,
        pdf_url
      }]);

      if (error) throw error;
      router.push('/admin/projects');
    } catch (error) {
      console.error(error);
      alert("Error adding project. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-8">Add New Project (With R2 Storage)</h1>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-sm border">
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold">Project Title</label>
            <input required type="text" className="w-full p-2.5 border rounded-lg" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Project Type</label>
            <select className="w-full p-2.5 border rounded-lg" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="Major">Major</option>
              <option value="Mini">Mini</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Education</label>
            <select className="w-full p-2.5 border rounded-lg" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})}>
              <option value="BTech">BTech</option>
              <option value="MTech">MTech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="Degree">Degree</option>
              <option value="MBA">MBA</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Branch (Optional)</label>
            <input type="text" className="w-full p-2.5 border rounded-lg" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} placeholder="e.g. CSE" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Sub Domain (Optional)</label>
            <input type="text" className="w-full p-2.5 border rounded-lg" value={formData.sub_domain} onChange={e => setFormData({...formData, sub_domain: e.target.value})} placeholder="e.g. AI/ML" />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold">Price</label>
            <input required type="text" className="w-full p-2.5 border rounded-lg" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. ₹2,999" />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold">Detailed Description</label>
            <textarea required className="w-full p-2.5 border rounded-lg min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="space-y-2 col-span-2">
            <label className="text-sm font-semibold">Features (Comma separated)</label>
            <input required type="text" className="w-full p-2.5 border rounded-lg" value={features} onChange={e => setFeatures(e.target.value)} />
          </div>
        </div>

        <div className="border-t pt-8 space-y-6">
          <h2 className="text-xl font-bold">Cloudflare R2 Media Uploads</h2>
          <p className="text-muted-foreground text-sm">Select files to automatically upload to your R2 bucket upon save.</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Images Upload */}
            <div className="border-2 border-dashed rounded-xl p-4 relative group hover:bg-muted/30 transition-colors">
              <label className="cursor-pointer flex flex-col items-center justify-center h-full min-h-[120px]">
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="font-semibold text-sm text-center">Thumbnail Images</span>
                <span className="text-xs text-muted-foreground mt-1 text-center">Click anywhere to browse (Multiple)</span>
                <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} className="hidden" />
              </label>
              
              {imageFiles.length > 0 && (
                <div className="absolute inset-0 bg-background/95 p-4 rounded-xl flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold">{imageFiles.length} images ready</span>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200" onClick={() => setImageFiles([])}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {imageFiles.map((f, i) => (
                      <img key={i} src={URL.createObjectURL(f)} className="h-16 w-16 object-cover rounded-md border border-muted flex-shrink-0" alt="Preview" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Video Upload */}
            <div className="border-2 border-dashed rounded-xl p-4 relative group hover:bg-muted/30 transition-colors">
              <label className="cursor-pointer flex flex-col items-center justify-center h-full min-h-[120px]">
                <Video className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="font-semibold text-sm text-center">Preview Video</span>
                <span className="text-xs text-muted-foreground mt-1 text-center">Click anywhere to browse</span>
                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="hidden" />
              </label>

              {videoFile && (
                <div className="absolute inset-0 bg-background/95 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200" onClick={() => setVideoFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Video className="h-8 w-8 text-primary mb-2" />
                  <span className="text-xs font-bold truncate max-w-full px-2">{videoFile.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">{(videoFile.size / (1024*1024)).toFixed(2)} MB</span>
                </div>
              )}
            </div>
            
            {/* PDF Upload */}
            <div className="border-2 border-dashed rounded-xl p-4 relative group hover:bg-muted/30 transition-colors">
              <label className="cursor-pointer flex flex-col items-center justify-center h-full min-h-[120px]">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="font-semibold text-sm text-center">Documentation PDF</span>
                <span className="text-xs text-muted-foreground mt-1 text-center">Click anywhere to browse</span>
                <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} className="hidden" />
              </label>

              {pdfFile && (
                <div className="absolute inset-0 bg-background/95 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                  <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200" onClick={() => setPdfFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                  <FileText className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-xs font-bold truncate max-w-full px-2">{pdfFile.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">{(pdfFile.size / (1024*1024)).toFixed(2)} MB</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full h-14 text-lg" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Uploading to R2 & Saving...</> : <><Save className="mr-2 h-5 w-5" /> Save Project & Media</>}
        </Button>
      </form>
    </div>
  );
}
