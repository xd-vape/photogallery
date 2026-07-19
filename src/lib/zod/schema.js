import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email("Ungültige E-Mail-Adresse"),
  password: z.string().min(1, "Passwort ist erforderlich"),
});

export const SignUpSchema = z
  .object({
    name: z
      .string()
      .min(3, "Username muss mindestens 3 Zeichen haben")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username darf nur Buchstaben, Zahlen und Unterstriche enthalten.",
      ),

    email: z.email("Ungültige E-Mail-Adresse"),

    password: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),

    confirmPassword: z.string().min(1, "Bitte Passwort bestätigen"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein!",
    path: ["confirmPassword"],
  });
