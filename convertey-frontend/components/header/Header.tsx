"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Moon,
  Menu,
  User,
  Info,
  DollarSign,
  Mail,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Bell,
} from "lucide-react";
import Link from "next/link";
import NavLink from "@/components/elements/header/NavLinks";
import { createSupabaseClient } from "@/lib/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import NotificationsPopover from "@/components/notification/NotificationsPopover";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [supabase] = useState(() => {
    const client = createSupabaseClient();
    if (!client) {
      console.error("Failed to create Supabase client");
      return null;
    }
    return client;
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log("User state:", user);
  }, [user]);

  useEffect(() => {
    // Dark mode toggle
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Only proceed if Supabase client is available
    if (!supabase) return;

    // Check if this is a verification callback
    const handleEmailVerification = async () => {
      // Check for email verification parameters
      const isVerification = searchParams?.get("type") === "email_confirmation";

      if (isVerification) {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Sign out the user
          await supabase.auth.signOut();
          // Redirect to login
          router.push("/login");
        }
      }
    };

    // Check user authentication status
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user ? { id: user.id, email: user.email ?? "" } : null);
    };

    handleEmailVerification();
    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session);
        // Handle email verification event
        if (event === "SIGNED_IN") {
          setUser(
            session?.user
              ? { id: session.user.id, email: session.user.email ?? "" }
              : null
          );
        }

        setUser(
          session?.user
            ? { id: session.user.id, email: session.user.email ?? "" }
            : null
        );
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [darkMode, supabase, router, searchParams]);

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="bg-transparent backdrop-blur-md dark:bg-opacity-33 shadow-md z-20 sticky top-0">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center ml-2 mt-1">
          <Image
            src={
              darkMode
                ? "/cosmoconverter-home-light.png"
                : "/cosmoconverter-home-dark.png"
            }
            alt="CosmoConverter Logo"
            width={250}
            height={48.44}
          />
        </Link>
        <div className="hidden md:flex space-x-5 items-center font-semibold">
          {user && (
            <>
              <NavLink href="/dashboard">Dashboard</NavLink>
            </>
          )}
          <NavLink href="/about">About Us</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/tools">Tools</NavLink>
          <NavLink href="/contact">Contact Us</NavLink>
          <NavLink href="/donate">Donate</NavLink>
          {user && <>{/* <NavLink href="/profile">Profile</NavLink> */}</>}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
            className="rounded-full bg-transparent border-purple-400 dark:border-purple-600 text-purple-600 dark:text-purple-400"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          {user ? (
            <>
              {/* <Button
                variant="outline"
                size="icon"
                aria-label="Notifications"
                onClick={() => router.push("/notifications")}
                className="rounded-full bg-transparent border-purple-400 dark:border-purple-600 text-purple-600 dark:text-purple-400"
              >
                <Bell className="h-5 w-5" />
              </Button> */}
              <NotificationsPopover />
              <Button
                variant="outline"
                size="icon"
                aria-label="Settings"
                onClick={() => router.push("/dashboard/profile/settings")}
                className="rounded-full bg-transparent border-purple-400 dark:border-purple-600 text-purple-600 dark:text-purple-400"
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="rounded-full border-purple-400 dark:border-purple-600 text-purple-600 dark:text-purple-400"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="rounded-full border-purple-400 dark:border-purple-600 text-purple-600 dark:text-purple-400 px-7 py-3"
              >
                Login
              </Button>
              <Button
                variant="default"
                onClick={() => router.push("/signup")}
                className="rounded-full bg-purple-600 text-white hover:bg-purple-700 px-6 py-3"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
            className="rounded-full mr-2 bg-transparent border-purple-400 dark:border-purple-600 text-purple-600 dark:text-purple-400"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log("Mobile menu open:", !mobileMenuOpen);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle menu"
            className="rounded-full text-purple-600 dark:text-purple-400"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden font-semibold text-center items-center justify-center bg-opacity-90 dark:bg-opacity-90 backdrop-blur-md py-2">
          {/* <NavLink href="/" className="block py-2 px-4">
            Home
          </NavLink> */}
          <NavLink
            href="/about"
            className="py-2 px-4 flex items-center text-center justify-center my-2"
          >
            <Info className="mr-2" /> About
          </NavLink>
          <NavLink
            href="/pricing"
            className="py-2 px-4 flex items-center text-center justify-center my-2"
          >
            <DollarSign className="mr-2" /> Pricing
          </NavLink>
          <NavLink
            href="/contact"
            className="py-2 px-4 flex items-center text-center justify-center my-2"
          >
            <Mail className="mr-2" /> Contact
          </NavLink>
          {user ? (
            <>
              <NavLink
                href="/dashboard"
                className="py-2 px-4 flex items-center text-center justify-center my-2"
              >
                <LayoutDashboard className="mr-2" /> Dashboard
              </NavLink>
              <NavLink
                href="/profile"
                className="py-2 px-4 flex items-center text-center justify-center my-2"
              >
                <User className="mr-2" /> Profile
              </NavLink>
              <NavLink
                href="/notifications"
                className="py-2 px-4 flex items-center text-center justify-center my-2"
              >
                <Bell className="mr-2" /> Notifications
              </NavLink>
              <button
                onClick={handleSignOut}
                className="py-2 px-4 w-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center text-center justify-center my-2"
              >
                <LogOut className="mr-2" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink
                href="/login"
                className="py-2 px-4 flex items-center text-center justify-center my-2"
              >
                <LogIn className="mr-2" /> Login
              </NavLink>
              <NavLink
                href="/signup"
                className="py-2 px-4 flex items-center text-center justify-center my-2"
              >
                <UserPlus className="mr-2" /> Sign Up
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
