"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaArrowRight, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { createSupabaseClient } from "@/lib/utils/supabase/client";

interface SignUpProps {
  showVerification: boolean;
  setShowVerification: (value: boolean) => void;
}

export default function SignUpPage({
  showVerification,
  setShowVerification,
}: SignUpProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!termsAgreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      setIsLoading(false);
      return;
    }

    if (!supabase) {
      setError("Supabase client not initialized");
      setIsLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Redirect to login page with verification success parameter
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
          data: {
            full_name: name,
          },
        },
      });

      if (authError) {
        console.error("Signup error:", authError);
        if (authError.message.includes("already registered")) {
          setError(
            "This email is already registered. Please use a different email or try logging in."
          );
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        setError("User creation failed");
        setIsLoading(false);
        return;
      }

      // Show verification message
      setShowVerification(true);
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      setError("An unexpected error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google") => {
    setError(null);
    setIsLoading(true);

    if (!supabase) {
      setError("Supabase client not initialized");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
      });

      if (error) {
        console.error("OAuth error:", error);
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Unexpected OAuth error:", err);
      setError("An unexpected error occurred during OAuth login");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (showVerification) {
    return (
      <div className="min-h-screen justify-center px-4 sm:px-6 lg:px-8 pt-20 sm:py-8 md:py-12">
        <div className="stars"></div>
        <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800/30">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-white shadow-md flex items-center justify-center border-slate-100 border">
              <FaEnvelope className="h-8 w-8 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Check Your Email
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We&apos;ve sent you a verification link
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-lg text-sm text-center">
              We&apos;ve sent a verification link to <strong>{email}</strong>.
              Please check your email and click the link to verify your account.
              You will be redirected to the login page in a few seconds.
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Go to Login Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-10">
      <div className="stars"></div>
      <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800/30">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-white shadow-md flex items-center justify-center border-slate-100 border">
            <Image
              src="/placeholder.svg"
              alt="Convertey Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Join Convertey
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create your account to get started
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 dark:focus:border-emerald-400"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label
                  htmlFor="email-address"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                >
                  Email Address
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 dark:focus:border-emerald-400"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 dark:focus:border-emerald-400 pr-10"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 mt-6">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 mt-1 border-gray-300 dark:border-gray-600 focus:border-emerald-500 focus:ring-emerald-500 dark:focus:border-emerald-400 rounded"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                disabled={isLoading}
              />
              <Label
                htmlFor="terms"
                className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
              >
                By signing up, you agree to our{" "}
                <Link
                  href="/terms-of-service"
                  className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={
                isLoading ||
                !termsAgreed ||
                !name.trim() ||
                !email.trim() ||
                !password.trim()
              }
              className="w-full h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center mt-6"
            >
              {isLoading ? (
                "Creating account..."
              ) : (
                <>
                  Create account
                  <FaArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={() => handleOAuthLogin("google")}
            disabled={isLoading}
            variant="outline"
            className="w-full h-11 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center"
          >
            <FcGoogle className="h-5 w-5 mr-3" />
            Continue with Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
