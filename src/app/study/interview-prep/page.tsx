"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function InterviewPrepPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase.from('interview_prep_docs').select('*').order('created_at', { ascending: false });
        if (error) console.error(error);
        setData(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddToCart = (doc: any) => {
    addToCart({
      id: doc.id,
      title: `${doc.company_name} - ${doc.title}`,
      price: doc.price,
      quantity: 1,
      image_url: doc.image_url,
      file_url: doc.file_url
    });
    alert(`${doc.title} added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-primary/5 py-20 border-b">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <Link href="/study" className="text-primary hover:underline font-semibold mb-4 inline-block">&larr; Back to Study Hub</Link>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
            Premium <span className="text-primary">Interview Prep</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Real interview questions, coding rounds, and behavioral questions asked by top tech companies. Instantly download the PDFs after checkout.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-16 max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((doc) => (
            <div key={doc.id} className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative h-64 bg-muted border-b overflow-hidden">
                {doc.image_url ? (
                  <Image src={doc.image_url} alt={doc.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm flex-col gap-3">
                    <FileText className="w-12 h-12 opacity-30" />
                    <div>No Preview Available</div>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-primary text-white font-bold px-3 py-1 rounded-lg text-xs shadow-sm">
                  {doc.company_name}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur text-foreground font-extrabold px-3 py-1.5 rounded-lg shadow-sm border text-sm">
                  ₹{doc.price}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-xl">{doc.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm mb-6 flex-grow">{doc.description}</p>
                
                <Button 
                  onClick={() => handleAddToCart(doc)}
                  className="w-full font-bold h-12 text-lg rounded-xl transition-transform hover:scale-[1.02]"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        {data.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Documents Available</h3>
            <p className="text-muted-foreground">Admin hasn't uploaded any interview prep materials yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
