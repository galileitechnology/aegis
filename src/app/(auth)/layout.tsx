import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AEGIS | Advanced Executive Guidance Intelligence System",
  description: "Resumo da folha de pontos de Jaicós",
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>{children}</>  // Using React Fragment or you could use a div instead
  );
}