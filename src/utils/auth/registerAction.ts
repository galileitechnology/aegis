"use server";

import { Message } from "@/types/message";
import { User } from "@/types/user";
import db from "@/lib/db";
import { hashSync } from "bcrypt-ts";
import { ConfirmRegisterEmail } from "../email/ConfirmRegisterEmail";

async function sendEmail(user: User) {
  const confirmEmail = new ConfirmRegisterEmail();
  if (!user.confirmCode) {
    return;
  }
  await confirmEmail.execute(user.name, user.email, user.confirmCode);
}

export default async function registerAction(
  formData: FormData
): Promise<Message> {
  const entries = Array.from(formData.entries());

  const data = Object.fromEntries(entries) as {
    name: string;
    email: string;
    password: string;
  };

  if (!data.name || !data.email || !data.password) {
    return { success: false, message: "Preencha todos os campos" };
  }

  const findUser = await db.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (findUser) {
    return { success: false, message: "Esse email já está em uso!" };
  }

  const confirmCode: string = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const user: User = await db.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashSync(data.password),
      confirmed: false,
      confirmCode,
    },
  });

  if (data.password.length < 8) {
    return {
      success: false,
      message: "A senha deve ter pelo menos 8 caracteres",
    };
  }

  sendEmail(user);
  return {
    success: true,
    message:
      "Enviamos um e-mail com o código de confirmação",
  };
}
