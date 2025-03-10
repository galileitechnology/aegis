"use server";

import { signIn } from "@/auth";
import db from "@/lib/db";
import { Message } from "@/types/message";
import { User } from "@/types/user";

export default async function loginAction(
  formData: FormData
): Promise<Message> {
  const entries = Array.from(formData.entries());

  const data = Object.fromEntries(entries) as {
    email: string;
    password: string;
  };

  if (!data.email || !data.password) {
    return { success: false, message: "Preencha todos os campos" };
  }

  const confirmUser = await db.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (confirmUser?.confirmed === false) {
    return {
      success: true,
      message:
        "Enviamos um e-mail de confirmação, acesse sua caixa de mensagens e confirme seu e-mail para continuar",
        duration: 20000
    };
  }

  try {
    await signIn("credentials", {
      email: data.email as string,
      password: data.password as string,
      redirect: false,
    });
    return { success: true, message: "Login efetuado com sucesso!" };
  } catch (e: any) {
    if (e.type === "CredentialsSignin") {
      return { success: false, message: "Email ou senha inválidos" };
    }
  }

  return { success: true, message: "Usuario Cadastrado com Sucesso" };
}
