import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";

export default async function Home() {
  const session = await getSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Photographer galleries
      </p>
      <h1 className="mt-4 max-w-2xl text-5xl font-semibold tracking-tight">
        Private client galleries without store or CRM bloat.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Create galleries, upload images, share password-protected links, collect
        favorites, and allow individual downloads when needed.
      </p>
      <div className="mt-8 flex gap-3">
        <Button>
          <Link href="/signup">
            Sign up
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline">
          <Link href="/login">Log in</Link>
        </Button>
      </div>
    </main>
  );
}
