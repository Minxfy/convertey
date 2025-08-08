import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Convertey",
  description: "Login to your Convertey account.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
