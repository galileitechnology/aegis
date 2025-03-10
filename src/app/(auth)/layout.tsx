import Backgroung from "@/public/bg/backgroung.jpg";
import Image from "next/image";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {/*<Image
        alt="fundo tela de login"
        src={Backgroung}
        className="fixed min-h-screen"
        quality={25}
      />*/}
      <section>{children}</section>
    </div>
  );
}
