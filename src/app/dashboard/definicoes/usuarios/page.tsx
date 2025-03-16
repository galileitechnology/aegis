"use client";

import { DataTable } from "@/components/dashboard/data-table";
import { UserCheck2, UserCogIcon } from "lucide-react";
import { columns } from "./columns";
import { User } from "@/types/user";

export default function Page() {
  const data: User[] = [
    { id: 1, name: "João", email: "joao@example.com" },
    { id: 2, name: "Maria", email: "maria@example.com" },
  ];
  return (
    <div>
      <h2 className="font-bold text-xl flex items-center gap-2 pb-5">
        <UserCogIcon size={30} /> Usuarios
      </h2>

      <div className="mt-5">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
