"use client";
import PassowordInput from "@/components/form/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginAction from "@/utils/auth/loginAction";
import Form from "next/form";
import Link from "next/link";
import { useState } from "react";
import { BsGearFill } from "react-icons/bs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (data: FormData) => {
    const result = await loginAction(data);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.push("/dashboard");
  };
  return (
    <div className="h-screen w-full flex flex-col gap-10 items-center justify-center p-5">
      <Form
        action={handleSubmit}
        className="z-10 w-full md:w-[400px] bg-white border shadow-2xl py-10 px-5 rounded"
      >
        <h2 className="flex items-center gap-2 font-bold text-2xl mb-5 justify-center">
          <BsGearFill /> Acesse o Sistema
        </h2>
        <div className="mb-3">
          <Label htmlFor="email" className="mb-2">
            Email:
          </Label>
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="Insira seu e-mail"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <PassowordInput />

        <div>
          <Button type="submit" className="w-full cursor-pointer">
            Enviar
          </Button>
        </div>
      </Form>

      <div className="text-gray-800/70 text-sm z-10">
        <span>Ainda não tem uma conta? </span>
        <span>
          <Link href={"/cadastrar"} className="font-bold">
            Cadastre-se
          </Link>
        </span>
      </div>
    </div>
  );
}
