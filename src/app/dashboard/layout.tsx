import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider defaultOpen={true} className="bg-neutral-900">
      <aside className="dark">
        <AppSidebar />
      </aside>
      <main className="w-full rounded-lg m-3 text-white bg-neutral-950">{children}</main>
    </SidebarProvider>
  );
}
