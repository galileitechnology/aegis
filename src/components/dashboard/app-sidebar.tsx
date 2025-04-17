"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { Session } from "@/interfaces/session";

import logoutAction from "@/utils/auth/logoutAction";
import { getFirstTwoNames } from "@/utils/getFirstTwoNames";

import { getInitials } from "@/utils/getInitials";

import {
  MessageCircle,
  LogOut,
  Settings2,
  Menu,
  LayoutDashboard,
  Settings,
  ChevronRight,
  User,
  Users,
  Target,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsGear } from "react-icons/bs";

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
  {
    title: "Tasks & Comm",
    url: "/management",
    icon: Target,
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
    <Sidebar collapsible={"icon"} variant={"sidebar"}>
      <SidebarContent className="overflow-hidden bg-neutral-900">
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
      <SidebarFooter className="bg-neutral-900">
        <SidebarMenu>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <Settings2 /> Definições
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <Link href={"/dashboard/definicoes"}>
                      <SidebarMenuButton>
                        <BsGear size={5} /> Geral
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <Link href={"/dashboard/definicoes/usuarios"}>
                      <SidebarMenuButton>
                        <Users size={5} /> Usuarios
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem />
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>

        <SidebarMenu>
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
