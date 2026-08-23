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
    const { data, error } = await supabase
      .from('hackathons_v2')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setHackathons(data);
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
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Discover Top <span className="text-primary">Hackathons</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
            Participate in the best hackathons from colleges and companies worldwide. Build, learn, and win!
          </p>
          <Link href="/hackathons/post">
            <Button size="lg" className="h-12 px-8 font-bold text-lg rounded-full shadow-lg hover:scale-105 transition-transform bg-white text-indigo-600 hover:bg-gray-100">
              <PlusCircle className="mr-2 h-5 w-5" /> Host a Hackathon
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
          <h3 className="text-xl font-bold">No upcoming hackathons</h3>
          <p className="text-gray-500 mt-2">Be the first to host an event for the community!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hackathons.map((hackathon) => (
            <div key={hackathon.id} className="bg-white dark:bg-zinc-900 rounded-2xl border shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group">
              <div className="h-48 w-full relative overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={hackathon.banner_url || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"} 
                  alt={hackathon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-3 line-clamp-2">{hackathon.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <span>{hackathon.event_date || hackathon.date || 'TBA'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    <span>{hackathon.city ? `${hackathon.city}${hackathon.state ? ', ' + hackathon.state : ''}` : hackathon.location || hackathon.mode || 'Online'}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-grow">{hackathon.description}</p>
                
                <div className="flex gap-3 mt-auto">
                  <Link href={`/hackathons/${hackathon.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">Details</Button>
                  </Link>
                  {hackathon.registration_link ? (
                    <a href={hackathon.registration_link} target="_blank" rel="noreferrer" className="flex-1">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Join <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </a>
                  ) : (
                    <Link href={`/hackathons/${hackathon.id}`} className="flex-1">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Join <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white dark:bg-zinc-900 z-10">
              <h2 className="text-2xl font-bold flex items-center gap-2"><PlusCircle className="text-indigo-600" /> Post Hackathon</h2>
              <button onClick={() => setShowPostModal(false)} className="text-gray-400 hover:text-gray-800"><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handlePostHackathon} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Hackathon Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-zinc-800" placeholder="e.g. Smart India Hackathon 2026" />
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
