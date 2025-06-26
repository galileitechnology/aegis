"use client";
import PasswordInput from "@/components/form/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginAction from "@/utils/auth/loginAction";
import Form from "next/form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsGearFill } from "react-icons/bs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Image } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.target as HTMLFormElement);
    const result = await loginAction(data);

    if (!result.success) {
      toast.error(result.message);
      setLoading(false);
      return;
    }

    if (result.type === "info") {
      toast.info(result.message);
    } else {
      toast.success(result.message);
    }
    setLoading(true);
    router.push("/dashboard");
  };
  return (
    <div className="h-screen w-full relative flex flex-col gap-10 items-center justify-center p-5 bg-[#000]">
        <img className="absolute left-0 bottom-0 md:w-1/4 h-[400px]" src="/images/layout.png" />
        <form
          onSubmit={handleSubmit}
          className="z-10 w-full md:w-[400px] bg-[#000] py-10"
        >
          <div className="text-left inline-grid grid-cols-1">
            <h1 className="font-bold text-3xl">AEGIS</h1>
            <h5 className="w-70 pb-8">
              Advanced Executive Guidance Intelligence System
            </h5>
          </div>

          <div className="relative align-right -mt-25 justify-self-end">
            <img src="/images/aegis_logo.png" className="relative h-20" />
          </div>

          <div className="mb-3 mt-9">
            <Label htmlFor="username" className="mb-2">
              ID:
            </Label>
            <Input
              name="username"
              type="text"
              id="username"
              disabled={loading}
              placeholder="Type your ID"
            />
          </div>

          <PasswordInput placeholder="Password" disabled={loading} />

          <div>
            <Button
              type="submit"
              className="text-white w-full cursor-pointer mt-5 bg-[#5200ff] hover:bg-[#5100ff79]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
                  Conectando...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>
          </div>
        </form>
    </div>
  );
}
