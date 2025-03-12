import db from "@/lib/db";
import AlterPasswordForm from "@/components/form/alter-password-form";
import { redirect } from "next/navigation";

type PageProps = {
  params: { id: string };
};

export default async function Page({ params }: PageProps) {
  const token = params.id;

  const result = await db.passwordResetToken.findFirst({
    where: {
      token: token
    }
  })

  if(!result) {
    redirect("/")
  }

  return <AlterPasswordForm />;
}
