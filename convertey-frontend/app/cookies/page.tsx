import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import { cookiesMetadata } from "@/app/metadata/cookies";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const Cookies = dynamic(() => import("@/components/cookies/CookiesPolicy"));

export const metadata: Metadata = cookiesMetadata;

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="stars"></div>
      <Suspense fallback={<p>Loading header...</p>}>
        <Header />
      </Suspense>
      <Cookies />
      <Footer />
    </div>
  );
}
