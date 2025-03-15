"use client";

import {
  MessageCircle,
  Home,
  LogOut,
  Settings2,
  Menu,
  LayoutDashboard,
} from "lucide-react";
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
import Link from "next/link";
import logoutAction from "@/utils/auth/logoutAction";
import { useEffect, useState } from "react";
import { Session } from "@/interfaces/session";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/getInitials";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getFirstTwoNames } from "@/utils/getFirstTwoNames";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
  },
];

export function AppSidebar() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      setSession(data);
    }

    fetchSession();
  }, []);

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
                <p>Usuario</p>
              </div>
            </SidebarGroupLabel>
            <SidebarSeparator className="mt-5" />
            <SidebarTrigger className="absolute top-1 right-1 flex items-center gap-2">
              <Menu /> Fechar Sidebar
            </SidebarTrigger>
          </SidebarHeader>
          <SidebarGroupContent className="mt-5">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={`${item.url}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/dashboard/definicoes"}>
              <SidebarMenuButton>
                <Settings2 /> Definições
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
