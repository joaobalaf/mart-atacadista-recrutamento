import type { NextFunction, Request, Response } from "express";
import { verifyAdminToken, type AdminTokenPayload } from "../services/auth.service.js";

export interface AuthedRequest extends Request {
  admin?: AdminTokenPayload;
}

export function requireAdminAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Não autenticado." });
  }

  try {
    req.admin = verifyAdminToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Sessão inválida ou expirada." });
  }
}
