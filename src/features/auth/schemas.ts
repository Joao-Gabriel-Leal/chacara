import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Digite um e-mail valido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

export const inviteSchema = z.object({
  inviteCode: z
    .string()
    .min(6, "Digite o codigo completo.")
    .transform((value) => value.toUpperCase()),
  name: z.string().min(2, "Digite seu nome."),
  email: z.email("Digite um e-mail valido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Digite um e-mail valido."),
});

export const profileSchema = z.object({
  name: z.string().min(2),
  nickname: z.string().min(2),
  bio: z.string().min(10).max(140),
  roleInEvent: z.string().min(2),
});

export const paymentProofSchema = z.object({
  amount: z.number().positive("Informe um valor valido."),
  note: z.string().max(140).optional(),
});
