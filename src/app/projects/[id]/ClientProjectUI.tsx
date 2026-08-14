"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, FileText, Upload, ShoppingCart, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from 'react-markdown';

export default function ClientProjectUI({ project }: { project: any }) {
  const { addToCart } = useCart();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    project.images && project.images.length > 0 ? project.images[0] : (project.image_url || null)
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleUploadAbstract = async () => {
    if (!file) return alert("Please select a document first.");
    setIsUploading(true);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'project-abstracts');
      
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();

      const { error } = await supabase.from('project_requests').insert([{
        project_id: project.id,
        project_title: project.title,
        document_url: url,
        status: 'Pending'
      }]);

      if (error) throw error;
      
      alert("Document uploaded successfully! Our team will review your custom requirements.");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Error uploading document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl">
      <Link href="/projects" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary mb-8 transition-colors bg-muted/50 px-4 py-2 rounded-full">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Marketplace
      </Link>
      
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Media Gallery Section */}
        <div className="space-y-6">
          {project.video_url && !selectedImage?.includes('blob:') && !selectedImage ? (
            <div className="relative aspect-video overflow-hidden rounded-3xl border shadow-2xl bg-black">
              <video src={project.video_url} controls className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-3xl border shadow-2xl bg-muted group">
              {selectedImage ? (
                <Image src={selectedImage} alt={project.title} fill className="object-contain group-hover:scale-105 transition-transform duration-700 bg-black/5" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Image src="/feature_resume.png" alt="Fallback" fill className="object-cover opacity-50" />
                  <span className="relative z-10 bg-background/80 px-4 py-2 rounded font-semibold backdrop-blur">No Preview Available</span>
                </div>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-4 gap-4">
            {project.video_url && (
              <div onClick={() => setSelectedImage(null)} className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer relative ${!selectedImage ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                 <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white font-bold text-xs z-10">VIDEO</div>
                 <Image src={project.images?.[0] || project.image_url || "/feature_resume.png"} alt="Video Thumb" fill className="object-cover opacity-30" />
              </div>
            )}
            
            {project.images && project.images.length > 0 ? (
              project.images.map((img: string, i: number) => (
                <div key={i} onClick={() => setSelectedImage(img)} className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer relative ${selectedImage === img ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'} transition-opacity`}>
                  <Image src={img} alt={`Thumb ${i+1}`} fill className="object-cover" />
                </div>
              ))
            ) : project.image_url ? (
               <div onClick={() => setSelectedImage(project.image_url)} className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer relative border-primary transition-opacity`}>
                  <Image src={project.image_url} alt="Thumb" fill className="object-cover" />
               </div>
            ) : null}
          </div>

          {project.pdf_url && (
            <div className="border rounded-2xl p-6 bg-muted/20 mt-8">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-lg"><FileText className="text-primary h-6 w-6"/> Project Documentation Preview</h3>
              <a href={project.pdf_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full h-12 font-bold shadow-sm">View Sample PDF Document</Button>
              </a>
            </div>
          )}
        </div>
        
        {/* Product Details Section */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-primary">
              {project.education}
            </span>
            {project.sub_domain && (
              <span className="inline-flex items-center rounded-md bg-blue-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-blue-500">
                {project.sub_domain}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-tight">{project.title}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">₹{project.price}</p>
            <div className="flex items-center gap-1 text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> 100% Original
            </div>
          </div>
          
          <div className="space-y-4 mb-10">
            <h3 className="text-xl font-bold">What's Included in this package:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-muted/30 p-3 rounded-xl border">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="font-medium text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Document Upload Widget */}
          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-2xl p-6 mb-10">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-500" /> Upload Base Abstract / Requirements
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Need this project customized? Upload your college's base paper, abstract, or specific custom requirements document (PDF/DOCX).
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()} 
                className="flex-1 border-2 border-dashed border-orange-300 dark:border-orange-800 rounded-xl p-4 text-center cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
              >
                <p className="text-sm font-bold text-orange-700 dark:text-orange-400 truncate">
                  {file ? file.name : "Click to select document"}
                </p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.docx,.doc" className="hidden" />
              </div>
              <Button 
                onClick={handleUploadAbstract} 
                disabled={!file || isUploading}
                className="h-auto px-6 bg-orange-500 hover:bg-orange-600 font-bold"
              >
                {isUploading ? "Uploading..." : "Submit File"}
              </Button>
            </div>
          </div>
          
          {/* Add to Cart Actions */}
          <div className="mt-auto pt-8 border-t flex flex-col sm:flex-row items-center gap-4">
            <Button 
              onClick={() => {
                const numericPrice = typeof project.price === 'string' ? 
                  parseFloat(project.price.replace(/[^\d.]/g, '')) : 
                  Number(project.price);
                  
                addToCart({
                  id: project.id,
                  title: project.title,
                  price: numericPrice || 0,
                  quantity: 1,
                  image_url: project.image_url || (project.images && project.images[0]),
                  file_url: project.pdf_url || project.file_url
                });
                alert(`${project.title} added to cart!`);
              }} 
              size="lg" 
              className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-xl flex items-center justify-center gap-3 rounded-2xl transition-transform hover:scale-105"
            >
              <ShoppingCart className="h-6 w-6" /> Add to Cart
            </Button>
            <Link href="/cart" className="w-full">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full h-16 text-xl font-bold shadow-sm rounded-2xl"
              >
                Go to Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Full-width Project Description Section */}
      <div className="mt-16 pt-16 border-t">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-8">Project Details & Documentation</h2>
          <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none whitespace-pre-wrap bg-white dark:bg-zinc-950 p-8 rounded-2xl border shadow-sm">
            <ReactMarkdown>{project.description}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
