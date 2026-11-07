"use client";

import type { ReactNode } from "react";
import GoogleAuthProvider from "./google.provider";
import QueryProvider from "./Quary.Provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (

    <GoogleAuthProvider>
      <QueryProvider>
        {children}
      </QueryProvider>

    </GoogleAuthProvider>

  );
}
