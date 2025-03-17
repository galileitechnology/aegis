export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div className="h-screen flex items-center justify-center text-4xl font-bold text-gray-500/80">Chat - {id}</div>;
}
