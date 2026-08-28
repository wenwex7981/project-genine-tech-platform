"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, X, Calendar, MapPin, Trophy, ExternalLink, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function HackathonsDirectory() {
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showPostModal, setShowPostModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "Online",
    registrationLink: "",
  });

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      // Use the server-side API which bypasses RLS using the service role key
      const res = await fetch('/api/insta-events');
      const json = await res.json();
      if (json.events) {
        setHackathons(json.events);
      }
    } catch (err) {
      console.error('Failed to fetch hackathons:', err);
    }
    setLoading(false);
  };

  const handlePostHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Fallback banner for now
    const fallbackBanner = `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`;

    const { error } = await supabase.from('hackathons').insert([{
      title: formData.title,
      description: formData.description,
      date: formData.date,
      location: formData.location,
      registration_link: formData.registrationLink,
      banner_url: fallbackBanner
    }]);

    setIsSubmitting(false);
    if (error) {
      alert("Failed to publish hackathon. Please check database connection.");
      console.error(error);
    } else {
      setShowPostModal(false);
      fetchHackathons();
      alert("Hackathon published successfully!");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-12 p-4 md:p-8">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 min-h-[350px] flex items-center p-8 md:p-12">
        <div className="absolute inset-0">
          <Image 
            src="/images/events-banner.png" 
            alt="Events and Hackathons Banner" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-white drop-shadow-md">
            Discover Top Events & Hackathons
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow">
            Participate in the best idea pitches, college fests, and hackathons worldwide. Build, learn, and win!
          </p>
          <Link href="/hackathons/post">
            <Button size="lg" className="h-12 px-8 font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform bg-white text-indigo-900 hover:bg-gray-100 border-none">
              <PlusCircle className="mr-2 h-5 w-5" /> Host an Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Upcoming Events</h2>
      
      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        </div>
      ) : hackathons.length === 0 ? (
        <div className="text-center p-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed">
          <Trophy className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold">No upcoming events</h3>
          <p className="text-gray-500 mt-2">Be the first to host an event for the community!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hackathons.map((hackathon) => {
            // ── Strip Instagram OG meta format from title
            // Instagram og:title looks like: "username on Date: actual caption"
            // Instagram og:desc looks like: "X likes, Y comments - username on Date: actual caption"
            const cleanTitle = (hackathon.title || 'Untitled Event')
              .replace(/^\d[\d,]*\s+likes?,\s*\d[\d,]*\s+comments?\s*[-–]\s*/i, '') // strip "811 likes, 2,622 comments -"
              .replace(/^[\w.\-_]+\s+on\s+\w+\s+\d+,?\s+\d{4}:\s*/i, '')           // strip "username on Aug 14, 2026:"
              .replace(/^"?(.+?)"?\s*$/, '$1')                                        // strip surrounding quotes
              .replace(/#\w+/g, '').replace(/@\w+/g, '')                              // strip hashtags/mentions
              .trim()
              .slice(0, 80) || 'Untitled Event';

            // ── Clean description the same way
            const cleanDesc = (hackathon.description || '')
              .replace(/^\d[\d,]*\s+likes?,\s*\d[\d,]*\s+comments?\s*[-–]\s*/i, '')
              .replace(/^[\w.\-_]+\s+on\s+\w+\s+\d+,?\s+\d{4}:\s*/i, '')
              .replace(/^"/, '')
              .trim()
              .slice(0, 200);

            // ── Generate unique gradient per event (based on title chars — no same image!)
            const gradients = [
              'from-violet-600 to-indigo-600',
              'from-pink-600 to-rose-600',
              'from-orange-500 to-amber-500',
              'from-emerald-500 to-teal-600',
              'from-blue-600 to-cyan-500',
              'from-purple-600 to-pink-600',
              'from-red-500 to-orange-500',
              'from-indigo-600 to-blue-500',
              'from-teal-500 to-green-500',
              'from-yellow-500 to-orange-600',
            ];
            const gradIndex = (hackathon.title || '').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0) % gradients.length;
            const gradient = gradients[gradIndex];

            const isInstagram = hackathon.org_name?.startsWith('@') || hackathon.org_name === 'Instagram Scout';
            const instagramProfileUrl = hackathon.contact_person && hackathon.contact_person !== 'Scout Bot'
              ? `https://www.instagram.com/${hackathon.contact_person}/`
              : hackathon.website || null;

            return (
              <div key={hackathon.id} className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group">
                {/* Banner — unique gradient + event title overlay (no same image problem) */}
                <div className={`h-44 w-full relative overflow-hidden bg-gradient-to-br ${gradient} flex items-end`}>
                  {/* Decorative circles */}
                  <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/10" />
                  <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10" />
                  {/* Title overlay */}
                  <div className="relative z-10 p-4 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      {isInstagram && (
                        <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm">
                          📸 Instagram
                        </span>
                      )}
                      <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm">
                        {hackathon.mode || 'Online'}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-base leading-snug line-clamp-2 drop-shadow">
                      {cleanTitle}
                    </h3>
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                      <span>{hackathon.event_date || 'TBA'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500 flex-shrink-0" />
                      <span>{hackathon.city || hackathon.mode || 'Online'}</span>
                    </div>
                    {hackathon.total_prize_pool && (
                      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Trophy className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>Prize: {hackathon.total_prize_pool}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">{cleanDesc || 'Click to see full details.'}</p>

                  <div className="flex gap-2 mt-auto flex-wrap">
                    {/* Organizer Instagram link */}
                    {isInstagram && instagramProfileUrl && (
                      <a href={instagramProfileUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-opacity">
                        <ExternalLink className="h-3 w-3" /> {hackathon.org_name || 'Instagram'}
                      </a>
                    )}
                    {/* Register / Join */}
                    {hackathon.registration_link ? (
                      <a href={hackathon.registration_link} target="_blank" rel="noreferrer" className="flex-1">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Register <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
                      </a>
                    ) : (
                      <Link href={`/hackathons/${hackathon.id}`} className="flex-1">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Details <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white dark:bg-zinc-900 z-10">
              <h2 className="text-2xl font-bold flex items-center gap-2"><PlusCircle className="text-indigo-600" /> Post Event</h2>
              <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-gray-800"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handlePostHackathon} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Event Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800" placeholder="e.g. Smart India Hackathon 2026 or College Tech Fest" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full min-h-[100px] p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800 resize-none" placeholder="Briefly describe the themes and prizes..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Date / Duration</label>
                  <input required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800" placeholder="e.g. Oct 15 - Oct 17" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Location</label>
                  <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800" placeholder="Online or City Name" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Registration Link</label>
                <input required type="url" value={formData.registrationLink} onChange={e => setFormData({...formData, registrationLink: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Upload Banner Image</label>
                <input type="file" accept="image/*" className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                <p className="text-xs text-gray-500 mt-2">*Image uploads will be enabled in production</p>
              </div>

              <div className="pt-4 mt-2 border-t">
                <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700 text-white">
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : "Publish Event"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
