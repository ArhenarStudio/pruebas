import React from "react";
import { useConfig } from "@/context/ConfigContext";
import { Storefront } from "@/components/storefront/Storefront";
import { Loader2 } from "lucide-react";

export default function StorePage() {
  const { savedConfig, loading } = useConfig();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#525252]" />
      </div>
    );
  }
  return (
    <div className="h-screen w-screen">
      <Storefront config={savedConfig} />
    </div>
  );
}
