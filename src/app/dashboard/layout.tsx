import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Metadata } from "next";
import { ThemeProvider } from '@/components/ui/theme-provider';

export const metadata: Metadata = {
  title: "AEGIS | Dashboard",
  description: "Resumo da folha de pontos de Jaicós",
};

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider
      defaultOpen={true}
      className="bg-neutral-900 relative"
    >
      <aside className="dark">
        <SidebarTrigger className="absolute md:hidden top-0 left-0 z-50 text-white">
          <Menu size={24} />
        </SidebarTrigger>
        <AppSidebar />
      </aside>
      <main className="w-full pt-3 text-white bg-neutral-950">
        {children}
      </main>
    </SidebarProvider>
  );
}