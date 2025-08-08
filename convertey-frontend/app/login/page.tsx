import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import type { Metadata } from "next";
import Login from "@/components/login/Login";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign In | Convertey",
  description:
    "Sign in to your Converteyaccount to access your files, settings, and more.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen">
      <div className="stars"></div>
      <Suspense fallback={<p></p>}>
        <Header />
        <Login />
        <Footer />
      </Suspense>
    </div>
  );
}
