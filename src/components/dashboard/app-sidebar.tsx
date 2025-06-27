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
  Database,
  LucideDatabase,
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
import { GiShieldcomb } from "react-icons/gi";
import { PiChartScatterBold } from "react-icons/pi";
import { TbRadar2 } from "react-icons/tb";
import { MdWarehouse } from "react-icons/md";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: PiChartScatterBold,
  },
  /*{
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
  },*/
  {
    title: "Sentry",
    url: "/solutions",
    icon: GiShieldcomb,
  },
  {
    title: "Watcher",
    url: "/docking",
    icon: TbRadar2,
  },
  {
    title: "Infrastructure",
    url: "/datacenters",
    icon: MdWarehouse,
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
      <SidebarContent className="overflow-hidden bg-[#111111]">
        <SidebarGroup>
          <SidebarGroupContent className="bg-[#111111] mt-5 relative top-29">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={`/dashboard${item.url}`}>
                      <item.icon />
                      <span className="text-[14px]">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#111111]">
        <SidebarMenu>
          <Collapsible className="group/collapsible">
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

        
      </SidebarFooter>
      <SidebarHeader className="bg-[#111111]">
            <SidebarGroupLabel className="bg-[#111111] flex gap-2 mt-2">
              <Avatar>
                <AvatarImage src="user.png" />
                <AvatarFallback className="bg-[#000000] text-[#dcdcdc] text-2xl font-bold">
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
            <SidebarSeparator className="bg-[#5200ff] mt-5"/>
            <SidebarTrigger className="bg-[#5200ff] absolute top-1 left-1 flex items-center gap-2">
              <Menu /> Fechar Sidebar
            </SidebarTrigger>
          </SidebarHeader>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logoutAction}>
              <LogOut /> Sair
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
    </Sidebar>
  );
}