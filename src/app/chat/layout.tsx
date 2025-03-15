"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import ChatMessages from "@/components/chat/chat-messages";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const handleSubmit = () => {};

  return (
    <SidebarProvider defaultOpen={false} className="dark">
      <aside>
        <ChatSidebar />
      </aside>
      <section></section>
      <main className="h-screen w-full">
        <div className="text-end fixed right-10 top-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-white bg-gray-800 hover:bg-gray-700"><PlusIcon size={18} /> Criar Sala</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Sala</DialogTitle>
                <form onSubmit={handleSubmit} className="mt-3">
                  <Input placeholder="Insira o nome da Sala" name="room_name" />

                  <div className="text-end mt-5">
                    <Button>Salvar</Button>
                  </div>
                </form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        {children}
      </main>
    </SidebarProvider>
  );
}
