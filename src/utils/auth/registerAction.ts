"use server";

import { Message } from "@/types/message";
import { User } from "@/types/user";
import db from "@/lib/db";
import { hashSync } from "bcrypt-ts";
import { ConfirmRegisterEmail } from "../email/ConfirmRegisterEmail";
import crypto from "crypto";

async function sendEmail(user: User) {
  const confirmEmail = new ConfirmRegisterEmail();
  if (!user.confirmToken) {
    return;
  }
  await confirmEmail.execute(user.name, user.email, user.confirmToken);
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

  const confirmToken: string = crypto.randomBytes(32).toString("hex");

  const user: User = await db.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashSync(data.password),
      confirmed: false,
      confirmToken,
    },
  });

  if (data.password.length < 8) {
    return {
      success: false,
      message: "A senha deve ter pelo menos 8 carateres",
    };
  }

  sendEmail(user);
  return {
    success: true,
    message:
      "Enviamos um e-mail de confirmação, acesse sua caixa de mensagens e confirme seu e-mail para continuar",
  };
}
