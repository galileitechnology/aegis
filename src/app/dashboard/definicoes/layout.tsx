import Link from "next/link";

const links = [
  {
    title: "Geral",
    url: "/",
  },
  {
    title: "Usuarios",
    url: "/usuarios",
  },
];

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div className="mt-3 flex gap-5 p-5">
        {links.map((link) => (
          <Link
            key={link.title}
            href={`/dashboard/definicoes` + link.url}
            className="py-2 px-5 rounded text-white bg-gray-700 hover:bg-gray-600"
          >
            <span>{link.title}</span>
          </Link>
        ))}
      </div>
      <section className="border border-gray-300/70 rounded shadow-xl p-5">
        {children}
      </section>
    </div>
  );
}
