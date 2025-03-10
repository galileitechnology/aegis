"use client";

import db from "@/lib/db";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function Page({ params }: PageProps) {
  const [confirmToken, setConfirmToken] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    params.then((resolvedParams) => {
      setConfirmToken(resolvedParams.id);
    });
  }, [params]);

  async function getUser() {
    if (!confirmToken) return;

    const user = await db.user.findFirst({
      where: {
        confirmToken: confirmToken,
      },
    });

    if (!user) {
      router.push("/");
      return;
    }

    db.user.update({
      where: {
        id: user.id,
      },
      data: {
        confirmed: true,
        confirmToken: null,
      },
    });
  }

  useEffect(() => {
    getUser();
  }, [confirmToken]);

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold">
          Seu email foi confirmado com sucesso!
        </h2>
        <p className="text-center mt-2">
          Já pode acessar o sistema através de tela de login
        </p>
      </div>
      <Link href={"/"} className="bg-blue-500 text-white rounded p-2 font-bold">
        Voltar para login
      </Link>
    </div>
  );
}
