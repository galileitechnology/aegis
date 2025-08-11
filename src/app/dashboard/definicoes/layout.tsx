export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>

      <section className="rounded p-5">
        {children}
      </section>
    </div>
  );
}
