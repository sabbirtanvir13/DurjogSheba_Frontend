import type { ReactNode } from "react";
import { Footer } from "@/components/layout/public/footer";
import { Header } from "@/components/layout/public/header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
}
