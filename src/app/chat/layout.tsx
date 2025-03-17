"use client";

import { useState } from "react";

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
import { createRoom } from "@/utils/chat/registerRoom";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [refreshRooms, setRefreshRooms] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.target as HTMLFormElement);
    const result = await createRoom(data);

    if (!result.success) {
      toast.error(result.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setOpen(false); // Fecha o diálogo
    setRefreshRooms((prev) => !prev); // Atualiza as salas
    toast.success(result.message);
  };

  return (
    <SidebarProvider defaultOpen={true} className="dark">
      <aside>
        <ChatSidebar refreshRooms={refreshRooms} />
      </aside>
      <section></section>
      <main className="h-screen w-full">
        <div className="text-end fixed right-10 top-5">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="text-white bg-gray-800 hover:bg-gray-700"
                onClick={() => setOpen(true)}
              >
                <PlusIcon size={18} /> Criar Sala
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Sala</DialogTitle>
                <form onSubmit={handleSubmit} className="mt-3">
                  <Input
                    disabled={loading}
                    placeholder="Insira o nome da Sala"
                    name="name"
                  />
                  <div className="text-end mt-5">
                    <Button disabled={loading}>
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
                          Salvando...
                        </div>
                      ) : (
                        "Salvar"
                      )}
                    </Button>
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
