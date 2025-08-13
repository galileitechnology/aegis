import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaicós | Folha de ponto",
  description: "Resumo da folha de pontos de Jaicós",
};


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