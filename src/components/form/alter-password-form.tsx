"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { alterPasswordAction } from "@/utils/auth/alterPasswordAction";
import Form from "next/form";
import PassowordInputs from "@/components/form/password-input";

export default function AlterPasswordForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    const result = await alterPasswordAction(formData);

    if (!result.success) {
      toast.error(result.message);
    }

    if (result.type === "info") {
      toast.info(result.message);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-5 md:p-0">
      <div className="z-10 bg-white w-[500px] p-5 rounded flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-bold mb-2">Altere sua senha</h2>
          <p className="text-sm">Informe sua nova senha</p>
        </div>
        <Form action={handleSubmit} className="flex flex-col">
          <div>
            <PassowordInputs />
          </div>
          <div className="mt-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <AiOutlineLoading3Quarters className="animate-spin w-5 h-5 mr-2" />
                  Salvando...
                </div>
              ) : (
                "Salvar"
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
