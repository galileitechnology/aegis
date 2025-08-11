"use server";

import { signIn } from "@/auth";
import { Message } from "@/types/message";

export default async function loginAction(
  formData: FormData
): Promise<Message> {
  const entries = Array.from(formData.entries());

  const data = Object.fromEntries(entries) as {
    username: string;
    password: string;
  };

  if (!data.username || !data.password) {
    return { success: false, message: "Preencha todos os campos" };
  }

  try {
    await signIn("credentials", {
      username: data.username as string,
      password: data.password as string,
      redirect: false,
    });
    return { success: true, message: "Credentials confirmed!" };
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "type" in e) {
      if (e.type === "CredentialsSignin") {
        return { success: false, message: "Invalid Email or Password" };
      }
    }

    return { success: false, message: "Try again later!" };
  }
}
