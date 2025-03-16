import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <aside className="dark">
        <AppSidebar />
      </aside>
      <main className="w-full pr-2">{children}</main>
    </SidebarProvider>
  );
}
