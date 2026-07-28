"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Loader2, Download, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setIsLoading(true);
    const { data, error } = await supabase.from('project_requests').select('*').order('created_at', { ascending: false });
    if (data) setRequests(data);
    setIsLoading(false);
  }

  const markAsCompleted = async (id: string) => {
    const { error } = await supabase.from('project_requests').update({ status: 'Completed' }).eq('id', id);
    if (!error) {
      setRequests(requests.map(r => r.id === id ? { ...r, status: 'Completed' } : r));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border">
        <div>
          <h1 className="text-3xl font-bold">Custom Requirements</h1>
          <p className="text-muted-foreground mt-1">View abstracts and base papers uploaded by users.</p>
        </div>
        <Button onClick={fetchRequests} variant="outline">Refresh Data</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-20 rounded-2xl border text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold">No Requests Yet</h2>
          <p className="text-muted-foreground">When users upload abstracts, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/50 text-muted-foreground text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Requested Project</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="p-4 align-middle whitespace-nowrap text-sm">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle font-medium">
                      {req.project_title}
                      {req.project_id && (
                        <Link href={`/projects/${req.project_id}`} target="_blank" className="text-xs text-primary block mt-1 hover:underline">
                          View Original Project
                        </Link>
                      )}
                    </td>
                    <td className="p-4 align-middle">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        req.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right space-x-2">
                      <a href={req.document_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" /> View Base Paper
                        </Button>
                      </a>
                      {req.status !== 'Completed' && (
                        <Button onClick={() => markAsCompleted(req.id)} size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                          <CheckCircle className="h-4 w-4" /> Mark Complete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
