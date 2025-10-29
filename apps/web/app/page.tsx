"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { UserLoginSchema } from "@repo/schemas";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";



export default function CardDemo() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    let parsed;
    try {
      console.log(Object.fromEntries(formData.entries()));
      parsed = UserLoginSchema.parse(Object.fromEntries(formData.entries()));
    } catch (err: z.ZodError | any) {
      if (err instanceof z.ZodError) {
        err.issues.forEach((issue) => {
          toast.error(issue.message);
        });
      }

      return setLoading(false);
    }

    try {
      const res = await fetch("BACKEND", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      const responseData = await res.json();
      toast.success(`Welcome ${responseData.user?.name || "back"}!`);
      // Redirect here if needed
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl p-6 md:p-8 space-y-6"
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Link href="/register">
                <Button variant="link">
                  Sign Up
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="user_email_label">Email</Label>
                <Input
                  id="user_email_input"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="user_password_input"
                  name="password"
                  type="password"
                  required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Logging in..." : "Log In"}
            </Button>
            <Link href="/project" className="w-full">
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
