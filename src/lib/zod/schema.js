import { z } from "zod";

const MAX_PASSWORD_LENGTH = 128;

export const SignInSchema = z.object({
  email: z.email("Ungültige E-Mail-Adresse"),
  password: z
    .string()
    .min(1, "Passwort ist erforderlich")
    .max(
      MAX_PASSWORD_LENGTH,
      `Passwort darf maximal ${MAX_PASSWORD_LENGTH} Zeichen lang sein`,
    ),
});

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Username muss mindestens 3 Zeichen haben")
      .max(50, "Username darf höchstens 50 Zeichen lang sein")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username darf nur Buchstaben, Zahlen und Unterstriche enthalten.",
      ),

    email: z.email("Ungültige E-Mail-Adresse"),

    password: z
      .string()
      .min(8, "Passwort muss mindestens 8 Zeichen lang sein")
      .max(
        MAX_PASSWORD_LENGTH,
        `Passwort darf höchstens ${MAX_PASSWORD_LENGTH} Zeichen lang sein`,
      ),

    confirmPassword: z
      .string()
      .min(1, "Bitte Passwort bestätigen")
      .max(
        MAX_PASSWORD_LENGTH,
        `Passwort darf höchstens ${MAX_PASSWORD_LENGTH} Zeichen lang sein`,
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein!",
    path: ["confirmPassword"],
  });
