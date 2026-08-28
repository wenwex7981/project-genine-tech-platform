import { seoLocations } from "@/lib/seo-data";
import Link from "next/link";
import { MapPin, Building, GraduationCap, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Service Locations & Universities | GraduateNex",
  description: "Browse final year projects, source code, and student services available in your state, city, or university.",
};

export default function LocationsIndexPage() {
  const states = seoLocations.filter(l => l.type === 'state');
  const cities = seoLocations.filter(l => l.type === 'city');
  const universities = seoLocations.filter(l => l.type === 'university');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Find Projects & Resources for Your <span className="text-blue-400">Location</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/80 mb-8 max-w-2xl mx-auto">
            We provide tailored engineering final year projects, documentation, and career tools specifically designed for universities across India.
          </p>
        </div>
      </section>

      {/* Directory Section */}
      <section className="py-16 md:py-24 container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="space-y-20">
          
          {/* Universities */}
          <div>
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
              <div className="p-3 bg-violet-100 dark:bg-violet-900/30 text-violet-600 rounded-xl">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Top Universities</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {universities.map(uni => (
                <Link key={uni.slug} href={`/locations/${uni.slug}`} className="group p-4 bg-white dark:bg-zinc-950 border rounded-xl hover:border-violet-500 hover:shadow-md transition-all flex items-center justify-between">
                  <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-1">{uni.name}</span>
                  <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-violet-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Cities */}
          <div>
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                <Building className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">Major Cities</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {cities.map(city => (
                <Link key={city.slug} href={`/locations/${city.slug}`} className="group p-4 bg-white dark:bg-zinc-950 border rounded-xl hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between">
                  <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{city.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* States */}
          <div>
            <div className="flex items-center gap-3 mb-8 border-b pb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight">States</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {states.map(state => (
                <Link key={state.slug} href={`/locations/${state.slug}`} className="group p-4 bg-white dark:bg-zinc-950 border rounded-xl hover:border-emerald-500 hover:shadow-md transition-all flex items-center justify-between">
                  <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{state.name}</span>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
