"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Activity, Bot, Zap, Database } from "lucide-react";

export default function AIUsageDashboard() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_usage_metrics")
        .select("*")
        .order("tokens_used", { ascending: false });

      if (error) {
        console.warn("Could not fetch metrics. If you haven't created the ai_usage_metrics table, please do so.", error);
        return;
      }

      // Aggregate data by model (since we might have multiple rows if RPC wasn't used)
      const aggregated: Record<string, { requests_count: number; tokens_used: number }> = {};
      data?.forEach((row) => {
        if (!aggregated[row.model_name]) {
          aggregated[row.model_name] = { requests_count: 0, tokens_used: 0 };
        }
        aggregated[row.model_name].requests_count += row.requests_count;
        aggregated[row.model_name].tokens_used += row.tokens_used;
      });

      const formattedData = Object.keys(aggregated).map(key => ({
        model_name: key,
        ...aggregated[key]
      })).sort((a, b) => b.tokens_used - a.tokens_used);

      setMetrics(formattedData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    // Refresh every 30 seconds automatically
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalRequests = metrics.reduce((acc, curr) => acc + curr.requests_count, 0);
  const totalTokens = metrics.reduce((acc, curr) => acc + curr.tokens_used, 0);

  // Define arbitrary limits for visual bars
  const TOKEN_LIMIT_ESTIMATE = 1000000;

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="max-w-5xl pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Activity className="text-blue-500" /> AI Usage Dashboard
        </h1>
        <p className="text-muted-foreground">Monitor real-time AI requests and token consumption.</p>
      </div>

      {/* Top Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-zinc-900 border p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Total API Requests</p>
            <h2 className="text-3xl font-black">{totalRequests.toLocaleString()}</h2>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Est. Tokens Consumed</p>
            <h2 className="text-3xl font-black">{totalTokens.toLocaleString()}</h2>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Active Models</p>
            <h2 className="text-3xl font-black">{metrics.length}</h2>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Model Consumption Breakdown</h2>
        </div>
        
        {metrics.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No AI usage data recorded yet. Generate some projects to see metrics here!
          </div>
        ) : (
          <div className="divide-y">
            {metrics.map((model, idx) => {
              const percentage = Math.min((model.tokens_used / TOKEN_LIMIT_ESTIMATE) * 100, 100);
              
              return (
                <div key={idx} className="p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg font-mono text-sm font-bold border">
                        {model.model_name.toUpperCase()}
                      </div>
                      <span className="text-sm text-muted-foreground">{model.requests_count} successful requests</span>
                    </div>
                    <div className="text-right font-bold">
                      {model.tokens_used.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">tokens</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="h-2 flex-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-xs font-mono w-12 text-right">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
