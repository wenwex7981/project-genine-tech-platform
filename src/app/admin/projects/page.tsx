"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, ExternalLink, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function AdminProjectsPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
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
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setData(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <div className="flex gap-3">
          <Link href="/admin/projects/bulk-ai">
            <Button variant="secondary" className="gap-2 border shadow-sm">
              <span className="text-purple-600 dark:text-purple-400 font-bold">Bulk AI Generate</span>
            </Button>
          </Link>
          <Link href="/admin/projects/new">
            <Button><Plus className="mr-2 h-4 w-4" /> Add New Project</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((proj) => (
          <div key={proj.id} className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-40 bg-muted border-b">
              {proj.image_url ? (
                <Image src={proj.image_url} alt={proj.title} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm flex-col gap-2">
                  <div className="bg-background border p-2 rounded">No R2 Image</div>
                </div>
              )}
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold line-clamp-1 mb-1" title={proj.title}>{proj.title}</h3>
              <p className="text-xs text-muted-foreground mb-3">{proj.education} • {proj.type}</p>
              
              <div className="flex gap-2 mb-4 text-xs font-medium">
                {proj.video_url && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200">Video</span>}
                {proj.pdf_url && <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">PDF</span>}
              </div>

              <div className="text-lg font-extrabold mb-4">{proj.price}</div>
              
              <div className="mt-auto flex gap-2">
                <Link href={`/projects/${proj.id}`} target="_blank" className="w-full">
                  <Button variant="outline" size="sm" className="w-full" title="View"><ExternalLink className="h-4 w-4"/></Button>
                </Link>
                <Link href={`/admin/projects/${proj.id}/edit`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/40" title="Edit">
                    <Edit className="h-4 w-4"/>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-red-50 hover:bg-red-100 text-red-600 border-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/40" 
                  title="Delete"
                  onClick={() => handleDelete(proj.id)}
                >
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-white dark:bg-zinc-900 border rounded-xl border-dashed">
            No projects found. Add one above.
          </div>
        )}
      </div>
    </div>
  );
}
