"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, ExternalLink, Trash2, Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function AdminResumesPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('resume_templates').select('*').order('created_at', { ascending: false });
      if (error) console.error(error);
      setData(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume template?")) return;
    try {
      const { error } = await supabase.from('resume_templates').delete().eq('id', id);
      if (error) throw error;
      setData(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Error deleting template");
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold">Manage Resume Templates</h1>
        <div className="flex gap-3">
          <Link href="/admin/resumes/bulk-ai">
            <Button variant="secondary" className="gap-2 border shadow-sm">
              <span className="text-pink-600 dark:text-pink-400 font-bold">Bulk AI Generate</span>
            </Button>
          </Link>
          <Link href="/admin/resumes/new">
            <Button><Plus className="mr-2 h-4 w-4" /> Add New Template</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((template) => (
          <div key={template.id} className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-48 bg-muted border-b">
              {template.image_url ? (
                <Image src={template.image_url} alt={template.title} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm flex-col gap-2">
                  <FileText className="w-8 h-8 opacity-50" />
                  <div>No Preview</div>
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold line-clamp-1 mb-1" title={template.title}>{template.title}</h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{template.description}</p>
              
              <div className="text-lg font-extrabold mb-4">{template.price}</div>
              
              <div className="mt-auto flex gap-2">
                {template.file_url && template.file_url !== 'pending' ? (
                  <Link href={template.file_url} target="_blank" className="w-full">
                    <Button variant="outline" size="sm" className="w-full" title="View Document">
                      <ExternalLink className="h-4 w-4"/>
                    </Button>
                  </Link>
                ) : template.file_url === 'pending' ? (
                  <Link href={`/view/${template.id}`} target="_blank" className="w-full">
                    <Button variant="outline" size="sm" className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border-indigo-200" title="View AI Document">
                      <ExternalLink className="h-4 w-4"/>
                    </Button>
                  </Link>
                ) : null}
                <Link href={`/admin/resumes/${template.id}/edit`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/40" title="Edit">
                    <Edit className="h-4 w-4"/>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 border-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40" 
                  title="Delete"
                  onClick={() => handleDelete(template.id)}
                >
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-white dark:bg-zinc-900 border rounded-xl border-dashed">
            No resume templates found. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}
