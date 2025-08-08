import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import AccessDenied from "@/components/access-denied/AccessDenied";
import { notFound404Metadata } from "@/app/metadata/not-found";
import React, { Suspense } from "react";

export const metadata: Metadata = notFound404Metadata;

export default function NotFound404() {
  return (
    <div className="min-h-screen">
      <div className="stars"></div>
      <Suspense fallback={<p>Loading header...</p>}>
        <Header />
      </Suspense>
      <AccessDenied />
      <Footer />
    </div>
  );
}
