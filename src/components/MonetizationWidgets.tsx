"use client";

import dynamic from "next/dynamic";

const PromoBar = dynamic(() => import("@/components/PromoBar"), { ssr: false });
const SocialProofToast = dynamic(() => import("@/components/SocialProofToast"), { ssr: false });
const ExitIntentPopup = dynamic(() => import("@/components/ExitIntentPopup"), { ssr: false });

export default function MonetizationWidgets() {
  return (
    <>
      <PromoBar />
      <SocialProofToast />
      <ExitIntentPopup />
    </>
  );
}
