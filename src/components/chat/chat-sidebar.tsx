"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import logoutAction from "@/utils/auth/logoutAction";
import { Session } from "@/interfaces/session";
import { getFirstTwoNames } from "@/utils/getFirstTwoNames";
import { getInitials } from "@/utils/getInitials";

import { LogOut, Menu, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getRooms } from "@/utils/chat/getRooms";

export function ChatSidebar({ refreshRooms }: { refreshRooms: boolean }) {
  const [session, setSession] = useState<Session | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data);
    }

    async function fetchRooms() {
      setLoading(true);
      const response = await getRooms();
      if (Array.isArray(response)) {
        setRooms(response);
      }
      setLoading(false);
    }

    fetchSession();
    fetchRooms();
  }, [refreshRooms]);

  return (
    <Sidebar collapsible={"icon"} variant={"floating"}>
      <SidebarContent className="overflow-hidden">
        <SidebarGroup>
          <SidebarHeader>
            <SidebarGroupLabel className="flex gap-2 mt-2">
              <Avatar>
                <AvatarImage src="user.png" />
                <AvatarFallback className="bg-gray-700 text-white text-2xl font-bold">
                  {session ? (
                    getInitials(session?.user?.name)
                  ) : (
                    <AiOutlineLoading3Quarters className="animate-spin w-5 h-5" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg">
                  {session
                    ? getFirstTwoNames(session?.user?.name)
                    : "Carregando..."}
                </h3>
                <p>Usuário</p>
              </div>
            </SidebarGroupLabel>
            <SidebarSeparator className="mt-5" />
            <SidebarTrigger className="absolute top-1 right-1 flex items-center gap-2">
              <Menu /> Fechar Sidebar
            </SidebarTrigger>
          </SidebarHeader>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {loading ? (
                <SidebarMenuItem className="flex gap-3">
                  <AiOutlineLoading3Quarters className="animate-spin w-5 h-5" />
                  <span>Carregando salas...</span>
                </SidebarMenuItem>
              ) : rooms.length > 0 ? (
                rooms.map((room) => (
                  <SidebarMenuItem key={room.id}>
                    <SidebarMenuButton asChild>
                      <Link href={`/chat/sala/${room.id}`}>
                        <span>{room.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <span>Nenhuma sala encontrada</span>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/dashboard"}>
              <SidebarMenuButton>
                <LayoutDashboard /> Dashboard
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logoutAction}>
              <LogOut /> Sair
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
