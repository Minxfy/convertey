import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import { profileMetadata } from "@/app/metadata/profile";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const Display = dynamic(() => import("@/components/user/profile/Display"));

export const metadata: Metadata = profileMetadata;

export default function DisplayPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="stars"></div>
      <Suspense fallback={<p>Loading header...</p>}>
        <Header />
      </Suspense>
      <Display />
      <Footer />
    </div>
  );
}
