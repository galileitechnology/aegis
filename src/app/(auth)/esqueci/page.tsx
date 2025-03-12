"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { forgetAction } from "@/utils/auth/forgetAction";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Page() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const result = await forgetAction(formData);

    if (!result.success) {
      toast.error(result.message);
      setLoading(false);
      return;
    }

    toast.success(result.message);
    setLoading(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-5 md:p-0">
      <div className="z-10 bg-white w-[500px] h-[260px] p-5 rounded flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold mb-2">Esqueceu sua senha?</h2>
          <p className="text-sm">
            Enviaremos um e-mail com instruções de como redefinir sua senha.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div>
            <Label htmlFor="email" className="mb-2">
              E-mail
            </Label>
            <Input
              name="email"
              id="email"
              className="bg-white"
              placeholder="Informe seu e-mail"
              disabled={loading}
            />
          </div>
          <div className="mt-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
                  Enviando...
                </div>
              ) : (
                "Enviar"
              )}
            </Button>
          </div>

          {loading ? (
            ""
          ) : (
            <Link
              href={"/"}
              className="text-center mt-3 underline text-blue-500"
            >
              Cancelar
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}
