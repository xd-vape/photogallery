import { redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/components";
import { getSession } from "@/lib/auth/session";
import { Camera } from "lucide-react";

export default async function SignupPage() {
  const session = await getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-foreground p-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-background/10">
            <Camera className="h-4 w-4 text-background" />
          </div>
          <span className="text-base font-semibold tracking-wide text-background">
            Framelab
          </span>
        </div>
        <div>
          <blockquote className="text-background/80 text-lg font-light leading-relaxed max-w-xs">
            &ldquo;Every photograph is a memory worth preserving. Deliver it
            beautifully.&rdquo;
          </blockquote>
          <p className="mt-4 text-xs text-background/40 tracking-widest uppercase">
            Photographer Studio Platform
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-foreground mb-1">
            Sign Up
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            Create your account to get started.
          </p>

          <AuthForm mode="signup" />
        </div>
      </div>

      {/* <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
      <p className="mt-2 text-muted-foreground">
        Start sharing private client galleries.
      </p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div> */}
    </main>
  );
}
