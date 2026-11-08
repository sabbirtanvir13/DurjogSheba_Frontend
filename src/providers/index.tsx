"use client";

import type { ReactNode } from "react";
import GoogleAuthProvider from "./google.provider";
import QueryProvider from "./Quary.Provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function Providers({ children }: { children: ReactNode }) {
  return (

    <GoogleAuthProvider>
      <QueryProvider>
        <TooltipProvider> 
        {children}
        </TooltipProvider>
      </QueryProvider>

    </GoogleAuthProvider>

  );
}
