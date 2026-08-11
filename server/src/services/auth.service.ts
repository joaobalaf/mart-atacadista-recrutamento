import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface AdminTokenPayload {
  sub: string;
  email: string;
  name: string;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAdminToken(payload: AdminTokenPayload) {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "8h") as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  const secret = process.env.JWT_SECRET as string;
  return jwt.verify(token, secret) as AdminTokenPayload;
}
