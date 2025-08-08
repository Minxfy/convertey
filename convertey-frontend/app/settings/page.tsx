import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ProfilePage from "@/components/user/profile/settings/ProfilePage";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "User Profile | Cosmo Converter",
  description:
    "Sign in to your Cosmo Converter account to access your files, settings, and more.",
};

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="stars"></div>
      <Suspense fallback={<p>Loading header...</p>}>
        <Header />
      </Suspense>
        <ProfilePage />
      <Footer />
    </div>
  );
}
