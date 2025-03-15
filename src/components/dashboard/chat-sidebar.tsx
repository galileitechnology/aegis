"use client";

import {
  MessageCircle,
  Home,
  LogOut,
  Settings2,
  Menu,
  LayoutDashboard,
  User,
  UserCircle,
  UserCircle2,
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

export function ChatSidebar() {
  return (
    <>
      <Sidebar collapsible={"icon"} variant={"floating"} >
        <SidebarContent className="overflow-hidden">
          <SidebarGroup>
            <SidebarHeader>
              <SidebarGroupLabel className="text-md">Salas de Chat</SidebarGroupLabel>
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
    </>
  );
}
