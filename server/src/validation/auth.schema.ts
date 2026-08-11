import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe o usuário."),
  password: z.string().min(1, "Informe a senha."),
});
