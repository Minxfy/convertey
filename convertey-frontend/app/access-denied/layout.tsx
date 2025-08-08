import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Denied | Convertey",
  description: "You need to be signed in to access this page.",
};

export default function AccessDeniedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
