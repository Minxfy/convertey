"use client";

import Header from "@/components/header/Header";
import Hero from "@/components/home-hero/Hero";
import Features from "@/components/home-features/Features";
import FileConverter from "@/components/file-converter/FileConverter";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 
    transition-colors duration-300"
    >
      <div className="stars"></div>
      <Header />
      <main className="container mx-auto px-4 relative z-10">
        <Hero />
        <Features />
        <FileConverter />
      </main>
      <Footer />
    </div>
  );
}
