import NotFound from "@/../public/errors/not-found.png"
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-5">
      <Image src={NotFound} alt="Página Não Encontrada" className="w-44 md:w-[500px]"  />
      <p className="text-xl">Oops, Não foi possível acessar a página</p>
      <Link href={"/"} className="bg-gray-800 py-2 px-5 rounded text-white">Página Inicial</Link>
    </div>
  );
}
