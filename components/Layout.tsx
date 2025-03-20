import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-4 sm:p-6">
      <Header />
      
      <main className="w-full max-w-4xl mx-auto flex flex-col gap-8 py-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
} 