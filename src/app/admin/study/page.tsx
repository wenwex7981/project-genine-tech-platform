"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function AdminStudyPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('interview_prep_docs').select('*').order('created_at', { ascending: false });
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
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const { error } = await supabase.from('interview_prep_docs').delete().eq('id', id);
      if (error) throw error;
      setData(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Error deleting document");
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold">Manage Interview Prep Docs</h1>
        <div className="flex gap-3">
          <Link href="/admin/study/bulk-ai">
            <Button variant="secondary" className="gap-2 border shadow-sm">
              <span className="text-blue-600 dark:text-blue-400 font-bold">Bulk AI Generate</span>
            </Button>
          </Link>
          <Link href="/admin/study/new">
            <Button><Plus className="mr-2 h-4 w-4" /> Add New Document</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((doc) => (
          <div key={doc.id} className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-48 bg-muted border-b">
              {doc.image_url ? (
                <Image src={doc.image_url} alt={doc.title} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm flex-col gap-2">
                  <FileText className="w-8 h-8 opacity-50" />
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                ₹{doc.price}
              </div>
              <div className="absolute top-2 left-2 bg-white text-black text-xs font-bold px-2 py-1 rounded max-w-[70%] truncate">
                {doc.company_name}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold mb-2 line-clamp-1">{doc.title}</h3>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{doc.description}</p>
              <div className="mt-auto flex gap-2">
                <Link href={`/admin/study/${doc.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Edit
                  </Button>
                </Link>
                {doc.file_url && doc.file_url !== 'pending' ? (
                  <a href={doc.file_url} target="_blank" rel="noreferrer" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                      View
                    </Button>
                  </a>
                ) : (
                  <Link href={`/view/${doc.id}`} target="_blank" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                      View (AI)
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="sm" className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleDelete(doc.id)}>
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl mt-8">
          <h3 className="text-xl font-bold mb-2">No documents yet</h3>
          <p className="text-muted-foreground">Click the button above to add your first interview prep document.</p>
        </div>
      )}
    </div>
  );
}
