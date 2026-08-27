"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, FileText, Lock, ShoppingCart, CheckCircle, ExternalLink, Eye, Mic, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function InterviewPrepPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch docs
        const { data: docs, error } = await supabase
          .from('interview_prep_docs')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) console.error(error);
        setData(docs || []);

        // Fetch user + their purchases
        const { data: { session } } = await supabase.auth.getSession();
        
        let adminStatus = session?.user?.email === "admin@graduatenex.online";
        if (typeof window !== "undefined" && sessionStorage.getItem("adminAuth") === "true") {
          adminStatus = true;
        }
        setIsAdmin(adminStatus);

        if (session?.user) {
          setUserEmail(session.user.email || null);
          const { data: orders } = await supabase
            .from('orders')
            .select('items')
            .eq('user_email', session.user.email);
          
          // Collect all purchased item IDs
          const ids: string[] = [];
          (orders || []).forEach((order: any) => {
            (order.items || []).forEach((item: any) => ids.push(String(item.id)));
          });
          setPurchasedIds(ids);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const isInCart = (id: string) => cart.some(c => String(c.id) === String(id));
  const isPurchased = (id: string) => purchasedIds.includes(String(id));

  const handleAddToCart = (doc: any) => {
    addToCart({
      id: doc.id,
      title: `${doc.company_name} - ${doc.title}`,
      price: doc.price,
      quantity: 1,
      image_url: doc.image_url,
      file_url: doc.file_url
    });
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
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white py-20 border-b">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <Link href="/study" className="text-indigo-200 hover:text-white font-semibold mb-4 inline-block">← Back to Study Hub</Link>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
            Premium <span className="text-purple-300">Interview Prep</span>
          </h1>
          <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
            Real interview questions from Deloitte, LinkedIn, FAANG startups & MNCs. Preview first half free — unlock full access after purchase.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/study/interview-prep/mock-interview">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-xl shadow-purple-900/50 hover:scale-105 transition-all">
                <Mic className="mr-2 h-5 w-5" /> AI Voice Mock Interview
              </Button>
            </Link>
            <Link href="/study/interview-prep/communication-builder">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-xl shadow-purple-900/50 hover:scale-105 transition-all">
                <Sparkles className="mr-2 h-5 w-5" /> Self-Intro Builder
              </Button>
            </Link>
            <Link href="/study/interview-prep/english-friend">
              <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-900/50 hover:scale-105 transition-all">
                <MessageCircle className="mr-2 h-5 w-5" /> AI English Friend "Alex"
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-16 max-w-6xl">
        {data.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border rounded-2xl shadow-sm">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Documents Available</h3>
            <p className="text-muted-foreground">Admin hasn't uploaded any interview prep materials yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((doc) => {
              const purchased = isPurchased(doc.id);
              const inCart = isInCart(doc.id);

              return (
                <div key={doc.id} className="bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                  
                  {/* Preview Area — shows half, blurs rest */}
                  <div className="relative h-72 bg-gray-50 dark:bg-zinc-800 overflow-hidden border-b">
                    {doc.image_url ? (
                      <>
                        {/* Top half visible */}
                        <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden">
                          <img src={doc.image_url} alt={doc.title} className="w-full object-cover object-top" />
                        </div>
                        {/* Bottom half blurred with lock overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden">
                          <img src={doc.image_url} alt="" className="w-full object-cover object-top blur-md scale-110 opacity-60" style={{ marginTop: "-50%" }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col items-center justify-center gap-2">
                            {purchased ? (
                              <div className="text-white flex flex-col items-center gap-1">
                                <CheckCircle className="w-8 h-8 text-green-400" />
                                <span className="text-sm font-bold">Purchased</span>
                              </div>
                            ) : (
                              <div className="text-white flex flex-col items-center gap-1">
                                <Lock className="w-8 h-8 text-yellow-300" />
                                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Full content locked</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full flex-col gap-3">
                        <FileText className="w-12 h-12 opacity-30" />
                        <span className="text-sm text-muted-foreground">Document Preview</span>
                        {!purchased && <Lock className="w-8 h-8 text-yellow-500 mt-2" />}
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-4 left-4 bg-indigo-600 text-white font-bold px-3 py-1 rounded-lg text-xs shadow max-w-[70%] truncate">
                      {doc.company_name}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-900 font-extrabold px-3 py-1.5 rounded-lg shadow border text-sm">
                      {purchased ? "✓ Owned" : `₹${doc.price}`}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-xl mb-2">{doc.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6 flex-grow line-clamp-2">{doc.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 mt-auto">
                    {isAdmin ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <a
                            href={doc.file_url === "pending" ? `/view/${doc.id}` : doc.file_url}
                            target={doc.file_url === "pending" ? "_self" : "_blank"}
                            rel="noreferrer"
                            className="flex-1 block"
                          >
                            <Button className="w-full font-bold h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center">
                              <ExternalLink className="w-4 h-4 mr-1" /> View
                            </Button>
                          </a>
                          <Link href={`/admin/study/${doc.id}/edit`} className="flex-1 block">
                            <Button className="w-full font-bold h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
                              Edit
                            </Button>
                          </Link>
                        </div>
                        <Link href={`/admin/study`} className="w-full block">
                          <Button variant="outline" className="w-full font-bold h-10 rounded-xl border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center">
                            Manage / Delete in Admin
                          </Button>
                        </Link>
                      </div>
                    ) : purchased ? (
                      <a
                        href={doc.file_url === "pending" ? `/view/${doc.id}` : doc.file_url}
                        target={doc.file_url === "pending" ? "_self" : "_blank"}
                        rel="noreferrer"
                        className="w-full block"
                      >
                        <Button className="w-full font-bold h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2">
                          <ExternalLink className="w-4 h-4" /> Open Full Document
                        </Button>
                      </a>
                    ) : inCart ? (
                      <Link href="/cart" className="w-full block">
                        <Button variant="outline" className="w-full font-bold h-12 rounded-xl border-indigo-500 text-indigo-600 hover:bg-indigo-50">
                          <ShoppingCart className="w-4 h-4 mr-2" /> Go to Cart & Pay
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={() => handleAddToCart(doc)}
                        className="w-full font-bold h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" /> Add to Cart — ₹{doc.price}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Modal — shows when admin preview mode would be used */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="font-bold text-lg">{previewDoc.title}</h2>
              <button onClick={() => setPreviewDoc(null)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
            <div className="relative">
              {previewDoc.image_url && (
                <img src={previewDoc.image_url} alt="" className="w-full" />
              )}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-8">
                <div className="text-center">
                  <Lock className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
                  <p className="font-bold">Purchase to unlock full document</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
