import { PrismaClient } from "@prisma/client";
import { hash, hashSync } from "bcrypt-ts";

const prisma = new PrismaClient();

async function main() {
  const root = await prisma.user.upsert({
    where: { email: "rodrigoantunestutz@gmail.com" },
    update: {},
    create: {
      email: process.env.ROOT_DATABASE_EMAIL ?? "root@mail.com",
      name: process.env.ROOT_DATABASE_NAME ?? "Administrador",
      password: hashSync(process.env.ROOT_DATABASE_PASSWORD ?? "123456789"),
      confirmed: true,
      confirmToken: null
    },
  });

  console.log("Usuario criado com sucesso", { root });
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
