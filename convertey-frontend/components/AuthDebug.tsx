// components/AuthDebug.tsx (temporary for debugging)
"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type AuthState = {
  session: boolean;
  user: boolean;
  sessionError?: string;
  userError?: string;
  userId?: string;
  cookies: string;
};

export default function AuthDebug() {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkAuth = async () => {
      // Check both session and user
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      setAuthState({
        session: !!session,
        user: !!user,
        sessionError: sessionError?.message,
        userError: userError?.message,
        userId: user?.id,
        cookies: document.cookie,
      });
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, !!session);
      checkAuth();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (!authState) return <div>Loading auth debug...</div>;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug Info:</h3>
      <div>Session: {authState.session ? "✅" : "❌"}</div>
      <div>User: {authState.user ? "✅" : "❌"}</div>
      <div>User ID: {authState.userId || "None"}</div>
      {authState.sessionError && (
        <div className="text-red-300">
          Session Error: {authState.sessionError}
        </div>
      )}
      {authState.userError && (
        <div className="text-red-300">User Error: {authState.userError}</div>
      )}
      <details className="mt-2">
        <summary>Cookies</summary>
        <div className="text-xs mt-1 break-all">{authState.cookies}</div>
      </details>
    </div>
  );
}
