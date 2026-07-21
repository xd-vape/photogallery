"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, SignUpSchema } from "@/lib/zod/schema";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

const AUTH_ERROR_MESSAGES = {
  USER_ALREADY_EXISTS:
    "Für diese E-Mail-Adresse existiert bereits ein Benutzerkonto.",

  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "Für diese E-Mail-Adresse existiert bereits ein Benutzerkonto.",

  INVALID_EMAIL_OR_PASSWORD: "E-Mail-Adresse oder Passwort ist falsch.",

  INVALID_PASSWORD: "E-Mail-Adresse oder Passwort ist falsch.",

  CREDENTIAL_ACCOUNT_NOT_FOUND: "E-Mail-Adresse oder Passwort ist falsch.",

  EMAIL_NOT_VERIFIED: "Bitte bestätige zuerst deine E-Mail-Adresse.",

  SIGNUP_DISABLED: "Die Registrierung ist derzeit deaktiviert.",

  FAILED_TO_CREATE_USER: "Das Benutzerkonto konnte nicht erstellt werden.",

  UNABLE_TO_CREATE_USER: "Das Benutzerkonto konnte nicht erstellt werden.",
};

function getAuthErrorMessage(authError, isSignup) {
  if (!authError) {
    return "";
  }

  if (authError.code && AUTH_ERROR_MESSAGES[authError.code]) {
    return AUTH_ERROR_MESSAGES[authError.code];
  }

  if (authError.status === 429) {
    return "Zu viele Versuche. Bitte warte kurz und versuche es erneut.";
  }

  if (authError.status >= 500) {
    return "Der Authentifizierungsdienst ist derzeit nicht verfügbar.";
  }

  return isSignup
    ? "Das Benutzerkonto konnte nicht erstellt werden."
    : "Die Anmeldung ist fehlgeschlagen.";
}

function FormFieldError({ id, error }) {
  if (!error?.message) {
    return null;
  }

  return (
    <p id={id} role="alert" className="text-xs text-destructive">
      {error.message}
    </p>
  );
}

export function AuthForm({ mode }) {
  const router = useRouter();

  const isSignup = mode === "signup";

  const [authError, setAuthError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isSignup ? SignUpSchema : SignInSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    setAuthError("");

    try {
      const result = isSignup
        ? await authClient.signUp.email({
            email: values.email,
            password: values.password,
            name: values.name,
          })
        : await authClient.signIn.email({
            email: values.email,
            password: values.password,
          });

      if (result.error) {
        setAuthError(getAuthErrorMessage(result.error, isSignup));
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setAuthError(
        "Der Server konnte nicht erreicht werden. Bitte versuche es erneut.",
      );
    }
  }

  return (
    <form
      id="form-auth"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {isSignup ? (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-medium text-foreground">
            Username
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your username"
            className="input-field"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />

          <FormFieldError id="name-error" error={errors.name} />
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-xs font-medium text-foreground">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="input-field"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />

        <FormFieldError id="email-error" error={errors.email} />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-foreground"
          >
            Password
          </Label>

          {!isSignup ? (
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </Link>
          ) : null}
        </div>
        <div className="relative">
          <Input
            name="password"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="input-field"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-controls="password"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        <FormFieldError id="password-error" error={errors.password} />
      </div>

      {isSignup ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="confirmPassword"
              className="text-xs font-medium text-foreground"
            >
              Confirm Password
            </Label>
          </div>
          <div className="relative">
            <Input
              name="confirmPassword"
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="input-field"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? "confirm-password-error" : undefined
              }
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={
                showConfirmPassword
                  ? "Hide password confirmation"
                  : "Show password confirmation"
              }
              aria-controls="confirmPassword"
            >
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <FormFieldError
            id="confirm-password-error"
            error={errors.confirmPassword}
          />
        </div>
      ) : null}

      {authError ? (
        <p
          id="auth-error"
          role="alert"
          aria-live="polite"
          className="text-center text-sm text-destructive"
        >
          {authError}
        </p>
      ) : null}

      <Button
        type="submit"
        className="mt-1 w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner /> : isSignup ? "Create account" : "Log in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isSignup ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          className="font-medium text-foreground underline underline-offset-4"
          href={isSignup ? "/login" : "/register"}
        >
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </form>
  );
}
