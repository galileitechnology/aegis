"use client";

import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "confirmed",
    header: "Confirmado?",
    cell: ({ row }) => {
      const confirmed = row.original.confirmed;
      return confirmed ? "Sim" : "Não";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return createdAt ? new Date(createdAt).toLocaleDateString("pt-BR") : "-";
    },
  },
];
