import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AEGIS | Advanced Executive Guidance Intelligence System",
  description: "Governance System",
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>{children}</>
  );
}