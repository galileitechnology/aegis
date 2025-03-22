"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import PassowordInput from "@/components/form/password-input";
import registerAction from "@/utils/auth/registerAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BsGearFill } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.target as HTMLFormElement);
    const result = await registerAction(data);

    if (!result.success) {
      toast.error(result.message, { duration: result.duration });
      setLoading(false);
      return;
    }

    toast.success(result.message);
    setLoading(false);
    router.push("/confirmar");
  };

  return (
    <div className="h-screen w-full flex flex-col gap-10 items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        className="z-10 bg-white w-full md:w-[400px] border shadow-2xl py-10 px-5 rounded"
      >
        <h2 className="flex items-center gap-2 font-bold text-2xl mb-5 justify-center">
          <BsGearFill /> Crie Sua Conta
        </h2>

        <div className="mb-3">
          <Label htmlFor="name" className="mb-1">
            Nome:
          </Label>
          <Input
            name="name"
            type="text"
            id="name"
            disabled={loading}
            placeholder="Insira seu nome"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <Label htmlFor="email" className="mb-1">
            Email:
          </Label>
          <Input
            name="email"
            type="email"
            id="email"
            disabled={loading}
            placeholder="Insira seu e-mail"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <PassowordInput disabled={loading} />

        <Button type="submit" className="w-full mt-5" disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center">
              <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
              Cadastrando...
            </div>
          ) : (
            "Cadastrar"
          )}
        </Button>
      </form>

      <div className="z-10 text-gray-800/70 text-sm">
        <span>Já tem uma conta? </span>
        <span>
          <Link href={"/"} className="font-bold">
            Faça login
          </Link>
        </span>
      </div>
    </div>
  );
}
