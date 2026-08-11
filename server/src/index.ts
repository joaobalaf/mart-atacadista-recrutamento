import "dotenv/config";
import path from "node:path";
import express from "express";
import cors from "cors";
import { publicRouter } from "./routes/public.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const isProduction = process.env.NODE_ENV === "production";

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/public", publicRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

if (isProduction) {
  const clientDist = path.join(process.cwd(), "client", "dist");
  app.use(express.static(clientDist));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use(errorHandler);

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./services/auth.service.js";

const port = Number(process.env.PORT) || 3333;
app.listen(port, async () => {
  console.log(`API MART Atacadista rodando em http://localhost:${port}`);
  
  try {
    const prisma = new PrismaClient();
    const adminEmail = "mart@atacadista.com.br";
    const existing = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
    if (!existing) {
      await prisma.adminUser.create({
        data: {
          email: adminEmail,
          name: "Administrador MART",
          passwordHash: await hashPassword("mart2020")
        }
      });
      console.log("Admin account 'mart@atacadista.com.br' created successfully.");
    }
  } catch (err) {
    console.error("Error creating default admin:", err);
  }
});
