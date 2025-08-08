// app/access-denied/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaHome, FaSignInAlt, FaLock } from "react-icons/fa";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800/30 text-center">
        <CardHeader className="pb-6">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <FaLock className="text-2xl text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You need to be signed in to access this page.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Link href="/login" className="block w-full">
              <Button className="w-full h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center">
                <FaSignInAlt className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>

            <Link href="/" className="block w-full">
              <Button
                variant="outline"
                className="w-full h-11 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
              >
                <FaHome className="mr-2 h-4 w-4" />
                Go to Homepage
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-emerald-600 hover:text-emerald-500"
            >
              Sign up here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
