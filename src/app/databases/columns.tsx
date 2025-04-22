"use client";

import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import deleteUserAction from "@/utils/auth/deleteUserAction";

export const getColumns = (onDeleteSuccess: () => void): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },/*
  {
    accessorKey: "confirmed",
    header: "Confirmado?",
    cell: ({ row }) => {
      const confirmed = row.original.confirmed;
      return confirmed ? "Sim" : "Não";
    },
  },*/
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return createdAt ? new Date(createdAt).toLocaleDateString("pt-BR") : "-";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const router = useRouter();

      const handleDelete = async () => {
        const result = await deleteUserAction(user.id);

        if (result.success) {
          toast.success(result.message);
          onDeleteSuccess();
        } else {
          toast.error(result.message);
        }
      };

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild className="cursor-pointer">
            <Button className="text-red-500" variant={"outline"} size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. Isso excluirá permanentemente o
                usuário.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer hover:bg-gray-200">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
