import db from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const confirmToken = id;

  const user = await db.user.findFirst({
    where: {
      confirmToken: confirmToken,
    },
  });

  if (!user) {
    redirect("/");
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      confirmToken: null, 
      confirmed: true,
    },
  });

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-5">
      <div className="z-10">
        <h2 className="text-2xl font-bold">
          Seu email foi confirmado com sucesso!
        </h2>
        <p className="text-center mt-2">
          Já pode acessar o sistema através de tela de login
        </p>
      </div>
      <Link
        href={"/"}
        className="bg-blue-500 text-white rounded p-2 font-bold z-10"
      >
        Voltar para login
      </Link>
    </div>
  );
}
