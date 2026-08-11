import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL || "admin@martatacadista.com.br";
  const password = process.env.ADMIN_SEED_PASSWORD || "MartAtacadista@2026";
  const name = process.env.ADMIN_SEED_NAME || "Administrador MART";

  console.log(`Creating admin: ${email}`);
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists, updating password...");
    await prisma.adminUser.update({
      where: { email },
      data: { passwordHash }
    });
  } else {
    await prisma.adminUser.create({
      data: { email, name, passwordHash }
    });
  }
  console.log(`Admin ready: ${email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
