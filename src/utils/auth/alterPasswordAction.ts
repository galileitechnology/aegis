"use server";

import db from "@/lib/db";
import crypto from "crypto";
import { Message } from "@/types/message";

export async function alterPasswordAction(
  formData: FormData
): Promise<Message> {
  const entries = Array.from(formData.entries());

  const data = Object.fromEntries(entries) as {
    password: string;
  };

  if (!data.password) {
    return { success: false, message: "Informe uma senha" };
  }

  if(data.password.length < 8) {
    return { success: false, message: "Sua senha deve ter pelo menos 8 caracteres" };
  }

  return {
    success: true,
    type: "info",
    message: "Função em Desenvolvimento",
  };
}
