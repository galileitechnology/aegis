"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/chat-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <aside className="dark">
        <ChatSidebar />
      </aside>
      <section></section>
      <main className="h-screen w-full">
        <div>{children}</div>
      </main>
    </SidebarProvider>
  );
}
