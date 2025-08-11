import db from "./db";
import { compareSync } from "bcrypt-ts";

export async function findUserByCredentials(username: string, password: string) {
  const user = await db.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!user) {
    return null;
  }

  const passwordMatch = compareSync(password, user.password);

  if (passwordMatch) {
    return {
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    };
  }

  return null;
}
