import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ClientHackathonUI from "./ClientHackathonUI";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: hackathon } = await supabase.from('hackathons').select('*').eq('id', id).single();
  
  if (!hackathon) {
    return {
      title: "Hackathon Not Found | GraduateNex",
    };
  }

  return {
    title: `${hackathon.title} | Tech Hackathons | GraduateNex`,
    description: hackathon.description.substring(0, 160),
    keywords: [hackathon.title, hackathon.theme || "", hackathon.mode || "", "hackathon in india", "tech event"],
    openGraph: {
      title: `${hackathon.title} | GraduateNex`,
      description: hackathon.description.substring(0, 160),
    },
  };
}

export default async function HackathonDetails({ params }: { params: Promise<{ id: string }> }) {
  // Pass the promise directly to the client component so it can unwrap it using `use()`
  return <ClientHackathonUI params={params} />;
}
