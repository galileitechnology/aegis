"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/dashboard/data-table";
import { PlusCircle, UserCogIcon } from "lucide-react";
import { columns } from "./columns";
import { User } from "@/types/user";

import { getUsers } from "@/utils/auth/getUsers";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import RegisterUser from "@/components/user/registerUser";

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
    <div className="min-h-96">
      <div className="flex justify-between items-center border-b pb-10">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <UserCogIcon size={30} /> Usuarios
        </h2>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle /> Novo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <AlertDialogHeader>
              <DialogTitle>Novo Usuario</DialogTitle>
              <RegisterUser isAdmin/>
            </AlertDialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-10">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
