"use client";

import Link from "next/link";
import logoutAction from "@/utils/auth/logoutAction";

import {
  LogOut,
  Menu,
  LayoutDashboard,
  UserCircle,
  UserCircle2,
} from "lucide-react";
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
import getSession from "@/utils/auth/getSessionData";
import { useEffect, useState } from "react";
import { Session } from "@/interfaces/session";

const items = [
  {
    title: "Sala 1",
    url: "/sala-1",
    icon: UserCircle,
  },
  {
    title: "Sala 2",
    url: "/sala-2",
    icon: UserCircle2,
  },
];

function getFirstTwoNames(fullName?: string): string {
  if (!fullName) return "";

  const names = fullName.split(" ");
  return names.slice(0, 2).join(" ");
}

function getInitials(fullName?: string): string {
  if (!fullName) return "";

  const names = fullName.split(" ");
  const initials = names.map((name) => name.charAt(0).toUpperCase()).join("");

  return initials;
}

export function ChatSidebar() {
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
                  {getInitials(session?.user?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg">
                  {getFirstTwoNames(session?.user?.name)}
                </h3>
                <p>Usuario</p>
              </div>
            </SidebarGroupLabel>
            <SidebarSeparator className="mt-5" />
            <SidebarTrigger className="absolute top-1 right-1 flex items-center gap-2">
              <Menu /> Fechar Sidebar
            </SidebarTrigger>
          </SidebarHeader>
          <SidebarGroupContent className="mt-2">
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
