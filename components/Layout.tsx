import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="grid grid-rows-[70px_1fr_70px] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header />
      
      <main className="w-full max-w-4xl flex flex-col gap-8 row-start-2 items-center">
        {children}
      </main>
      
      <Footer />
    </div>
  );
} 