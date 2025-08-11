import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcrypt-ts";

const prisma = new PrismaClient();

async function main() {
  const root = await prisma.user.upsert({
    where: { username: process.env.ROOT_DATABASE_USERNAME },
    update: {},
    create: {
      username: process.env.ROOT_DATABASE_USERNAME ?? "admin",
      name: process.env.ROOT_DATABASE_NAME ?? "Administrador",
      password: hashSync(process.env.ROOT_DATABASE_PASSWORD ?? "123456789"),
    },
  });

  console.log("Usuário padrão criado com sucesso", {
    root,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
