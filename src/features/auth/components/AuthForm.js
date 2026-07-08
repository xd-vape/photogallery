"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema, SignUpSchema } from "@/lib/zod/schema";

export function AuthForm({ mode }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === "signup";

  const form = useForm({
    resolver: zodResolver(isSignup ? SignUpSchema : SignInSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  function onSubmit(values) {
    setError("");

    startTransition(async () => {
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

      if (result?.error) {
        setError(result.error.message || "Authentication failed.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {isSignup ? (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-medium text-foreground">
            Username
          </Label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your username"
            className="input-field"
            {...register("name")}
          />
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-xs font-medium text-foreground">
          Email
        </Label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="input-field"
          {...register("email")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="password"
            className="text-xs font-medium text-foreground"
          >
            Password
          </Label>

          {isSignup ? null : (
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <div className="relative">
          <input
            name="password"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="input-field"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-center text-sm text-destructive">{error}</p>
      ) : null}

      <Button
        type="submit"
        disabled={isPending}
        className="mt-1 w-full rounded-md bg-foreground py-2.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors disabled:opacity-60"
      >
        {isPending ? "Please wait..." : isSignup ? "Create account" : "Log in"}
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
