import { z } from "zod";

const AuthBaseSchema = z.object({
  email: z.email("Ungültige E-Mail-Adresse"),
  password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
});

export const SignInSchema = AuthBaseSchema;

export const SignUpSchema = AuthBaseSchema.extend({
  name: z
    .string()
    .min(3, "Username muss mindestens 3 Zeichen haben")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),

  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein!",
  path: ["confirmPassword"],
});
