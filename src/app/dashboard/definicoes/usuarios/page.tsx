"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { UserCogIcon } from "lucide-react";
import { columns } from "./columns";
import { User } from "@/types/user";

import { getUsers } from "@/utils/auth/getUsers";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Page() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);

      const response = await getUsers();

      if (Array.isArray(response)) {
        setData(response);
      }

      setLoading(false);
    }

    fetchUsers();
  }, []);

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
