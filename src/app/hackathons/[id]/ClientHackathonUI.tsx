"use client";

import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Calendar, MapPin, ExternalLink, ArrowLeft, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// ── Strip Instagram OG meta format
function cleanInstaText(raw: string | null, maxLen = 1000): string {
  if (!raw) return '';
  return raw
    .replace(/^\d[\d,]*\s+likes?,\s*\d[\d,]*\s+comments?\s*[-–]\s*/i, '')
    .replace(/^[\w.\-_]+\s+on\s+\w+\s+\d+,?\s+\d{4}:\s*/i, '')
    .replace(/^"/, '').replace(/"$/, '')
    .trim()
    .slice(0, maxLen);
}

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
    
    if (!error && data) setHackathon(data);
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

  const isInstagram = hackathon.org_name?.startsWith('@') || hackathon.org_name === 'Instagram Scout';
  const instagramUsername = hackathon.contact_person && hackathon.contact_person !== 'Scout Bot'
    ? hackathon.contact_person : null;
  const instagramProfileUrl = instagramUsername
    ? `https://www.instagram.com/${instagramUsername}/`
    : hackathon.website || null;

  const cleanTitle = cleanInstaText(hackathon.title, 120) || hackathon.title || 'Untitled Event';
  const cleanDesc  = cleanInstaText(hackathon.description, 5000) || '';

  // ── Unique gradient per event title
  const gradients = [
    'from-violet-600 to-indigo-600', 'from-pink-600 to-rose-600',
    'from-orange-500 to-amber-500', 'from-emerald-500 to-teal-600',
    'from-blue-600 to-cyan-500', 'from-purple-600 to-pink-600',
    'from-red-500 to-orange-500', 'from-indigo-600 to-blue-500',
    'from-teal-500 to-green-500', 'from-yellow-500 to-orange-600',
  ];
  const gradIndex = (hackathon.title || '').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0) % gradients.length;
  const gradient = gradients[gradIndex];

  // ── Primary CTA link
  const primaryLink = hackathon.registration_link || hackathon.website || instagramProfileUrl;

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 mb-20">
      <Link href="/hackathons" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6 px-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events Directory
      </Link>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border shadow-lg overflow-hidden">
        {/* Banner — gradient (no same-image problem) */}
        <div className={`h-64 md:h-72 w-full relative bg-gradient-to-br ${gradient} flex items-end`}>
          <div className="absolute top-6 right-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -top-6 -left-6 w-52 h-52 rounded-full bg-white/10" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 p-8 md:p-12 w-full">
            {isInstagram && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-white/25 text-white px-3 py-1 rounded-full font-semibold backdrop-blur-sm mb-3">
                📸 Sourced from Instagram
              </span>
            )}
            <h1 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg leading-tight pr-0 md:pr-52">
              {cleanTitle}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 relative">
          {/* Floating CTA */}
          <div className="md:absolute right-12 top-0 md:-translate-y-1/2 flex flex-col gap-2 mt-6 md:mt-0 bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-xl border min-w-[220px]">
            {primaryLink ? (
              <a href={primaryLink} target="_blank" rel="noreferrer">
                <Button size="lg" className="w-full h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md">
                  {hackathon.registration_link ? 'Register Now' : isInstagram ? 'View on Instagram' : 'Visit Event'} <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            ) : null}
            {isInstagram && instagramProfileUrl && (
              <a href={instagramProfileUrl} target="_blank" rel="noreferrer">
                <Button size="lg" variant="outline" className="w-full h-12 px-6 rounded-xl border-pink-300 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> @{instagramUsername || 'View Organizer'}
                </Button>
              </a>
            )}
          </div>

          {/* Meta grid */}
          <div className="flex flex-wrap gap-6 mb-10 py-6 border-y mt-4 md:mt-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Date</p>
                <p className="font-bold">{hackathon.event_date || 'TBA'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Location</p>
                <p className="font-bold">
                  {hackathon.mode === 'Online' ? 'Online'
                    : [hackathon.venue, hackathon.city, hackathon.state].filter(Boolean).join(', ') || 'Online'}
                </p>
              </div>
            </div>

            {/* Organized By — links to Instagram profile if scraped */}
            {hackathon.org_name && (
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">Organized By</p>
                  {isInstagram && instagramProfileUrl ? (
                    <a
                      href={instagramProfileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-1"
                    >
                      {hackathon.org_name} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    hackathon.website ? (
                      <a href={hackathon.website} target="_blank" rel="noreferrer"
                        className="font-bold text-indigo-600 hover:underline flex items-center gap-1">
                        {hackathon.org_name} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <p className="font-bold">{hackathon.org_name}</p>
                    )
                  )}
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

          {/* Description */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              About This Event
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                {cleanDesc || 'No description available. Visit the Instagram post for more details.'}
              </p>
            </div>

            {/* Instagram source link at bottom */}
            {isInstagram && instagramProfileUrl && (
              <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 rounded-2xl border border-pink-200 dark:border-pink-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-pink-700 dark:text-pink-300 text-sm">Scraped from Instagram</p>
                  <p className="text-xs text-gray-500 mt-0.5">Click to view the original post or organizer's profile</p>
                </div>
                <div className="flex gap-2">
                  {hackathon.website && (
                    <a href={hackathon.website} target="_blank" rel="noreferrer">
                      <Button size="sm" className="bg-gradient-to-r from-pink-500 to-orange-500 text-white border-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 mr-1.5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> Profile
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
