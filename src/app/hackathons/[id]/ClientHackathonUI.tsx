"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Calendar, MapPin, ExternalLink, ArrowLeft, Trophy, Users, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HackathonDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [hackathon, setHackathon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHackathon();
  }, [resolvedParams.id]);

  const fetchHackathon = async () => {
    const { data, error } = await supabase
      .from('hackathons_v2')
      .select('*')
      .eq('id', resolvedParams.id)
      .single();
    
    if (!error && data) {
      setHackathon(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center p-32">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-12 p-8 text-center">
        <h2 className="text-2xl font-bold">Event Not Found</h2>
        <Link href="/hackathons" className="text-indigo-600 mt-4 inline-block hover:underline">
          <ArrowLeft className="inline mr-2 h-4 w-4" /> Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 mb-20">
      <Link href="/hackathons" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 px-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events Directory
      </Link>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border shadow-lg overflow-hidden">
        {/* Banner */}
        <div className="h-64 md:h-96 w-full relative bg-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={hackathon.banner_url || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"} 
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 relative">
          {/* Action Bar Floating */}
          <div className="md:absolute right-12 top-0 md:-translate-y-1/2 flex gap-4 mt-6 md:mt-0 bg-white dark:bg-zinc-900 p-2 rounded-2xl shadow-xl border">
            {hackathon.registration_link ? (
              <a href={hackathon.registration_link} target="_blank" rel="noreferrer" className="w-full">
                <Button size="lg" className="w-full h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md">
                  Join Event <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </a>
            ) : (
              <a href={`mailto:${hackathon.contact_email}`} className="w-full">
                <Button size="lg" className="w-full h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md">
                  Contact Organizer <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </a>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 mt-4 md:mt-8 pr-0 md:pr-48">{hackathon.title}</h1>
          
          <div className="flex flex-wrap gap-6 mb-10 py-6 border-y">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Date</p>
                <p className="font-bold">{hackathon.event_date || hackathon.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Location</p>
                <p className="font-bold">
                  {hackathon.mode === 'Online' 
                    ? 'Online' 
                    : [hackathon.address, hackathon.city, hackathon.district, hackathon.state, hackathon.country].filter(Boolean).join(', ') || hackathon.location || 'Offline'}
                </p>
              </div>
            </div>

            {hackathon.org_name && (
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Organized By</p>
                  <p className="font-bold">{hackathon.org_name}</p>
                </div>
              </div>
            )}
            {hackathon.total_prize_pool && (
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Prize Pool</p>
                  <p className="font-bold">{hackathon.total_prize_pool}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              About This Event
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                {hackathon.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
