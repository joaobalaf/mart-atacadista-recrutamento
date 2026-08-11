import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { signAdminToken, verifyPassword } from "../services/auth.service.js";
import { loginSchema } from "../validation/auth.schema.js";
import { requireAdminAuth, type AuthedRequest } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const token = signAdminToken({ sub: admin.id, email: admin.email, name: admin.name });
    res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (err) {
    next(err);
  }
});

authRouter.get("/me", requireAdminAuth, (req: AuthedRequest, res) => {
  res.json({ admin: req.admin });
});
