"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// UI shell only. Supabase auth is wired here in Milestone 2 —
// replace the onSubmit notice with supabase.auth.signInWithPassword / signUp.
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [notice, setNotice] = useState<string | null>(null);
  const isLogin = mode === "login";

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">
          {isLogin ? "Log in" : "Create your account"}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? "Welcome back. Your projects are where you left them."
            : "Free tier: one full case study, no card required."}
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setNotice(
            "Accounts open with the beta launch — auth is being wired up now.",
          );
        }}
      >
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              minLength={8}
            />
          </div>
          {notice && (
            <p
              role="status"
              className="rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground"
            >
              {notice}
            </p>
          )}
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-3">
          <Button type="submit" className="w-full">
            {isLogin ? "Log in" : "Start free"}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isLogin ? (
              <>
                New here?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Log in
                </Link>
              </>
            )}
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
