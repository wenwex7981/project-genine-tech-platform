import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ClientProjectUI from "./ClientProjectUI";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data: project } = await supabase.from('projects').select('*').eq('id', id).single();
  
  if (!project) {
    return {
      title: "Project Not Found | GraduateNex",
    };
  }

  return {
    title: `${project.title} | Final Year Project Source Code | GraduateNex`,
    description: project.description.substring(0, 160),
    keywords: [project.title, project.education, project.sub_domain || "", "source code", "final year project"],
    openGraph: {
      title: `${project.title} | GraduateNex`,
      description: project.description.substring(0, 160),
      images: project.images && project.images.length > 0 ? [{ url: project.images[0] }] : (project.image_url ? [{ url: project.image_url }] : []),
    },
  };
}

export default async function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: project, error } = await supabase.from('projects').select('*').eq('id', id).single();

  if (error || !project) {
    notFound();
  }

  return <ClientProjectUI project={project} />;
}
