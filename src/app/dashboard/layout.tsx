import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="dark">
      <aside>
        <AppSidebar />
      </aside>
      <main className="w-full">
        <SidebarTrigger className="fixed"/>
        {children}
      </main>
    </SidebarProvider>
  );
}
