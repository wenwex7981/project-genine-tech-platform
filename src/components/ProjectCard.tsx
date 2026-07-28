import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface ProjectCardProps {
  id?: string;
  title: string;
  type: string;
  education: string;
  branch?: string;
  subDomain?: string;
  price: string;
}

export function ProjectCard({ id = "1", title, type, education, branch, subDomain, price }: ProjectCardProps) {
  return (
    <div className="flex flex-col justify-between overflow-hidden bg-white dark:bg-zinc-900 rounded-xl border shadow-sm hover:shadow-md transition-shadow group">
      
      {/* Thumbnail Image */}
      <div className="relative h-48 w-full bg-muted overflow-hidden">
        <Image 
          src="/project_card.png" 
          alt={title} 
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
            {type} Project
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className="text-lg font-extrabold text-foreground">{price}</span>
        </div>
        <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-tight">{title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4 mt-auto pt-2">
          <span className="inline-flex items-center rounded-md bg-orange-50 dark:bg-orange-950/30 px-2 py-1 text-xs font-medium text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/50">
            {education}
          </span>
          {branch && (
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground border">
              {branch}
            </span>
          )}
          {subDomain && (
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground border">
              {subDomain}
            </span>
          )}
        </div>
        
        <Link href={`/projects/${id}`} className="w-full mt-2">
          <Button className="w-full gap-2 transition-all group-hover:bg-primary/90">
            View Details <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
