"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Redirect authenticated users to the home dashboard
        router.push("/home");
      }
    };
    checkUser();
  }, [router]);

  return null;
}
