"use client";

import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";

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
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return createdAt ? new Date(createdAt).toLocaleDateString("pt-BR") : "-";
    },
  },
  
  
];
