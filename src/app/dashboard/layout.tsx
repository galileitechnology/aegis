import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider defaultOpen={false} className="dark">
      <aside>
        <AppSidebar />
      </aside>
      <main className="w-full dark">{children}</main>
    </SidebarProvider>
  );
}
