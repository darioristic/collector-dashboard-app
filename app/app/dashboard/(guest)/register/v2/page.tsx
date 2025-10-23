import Link from "next/link";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateMeta } from "@/lib/utils";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export function generateMetadata() {
  return generateMeta({
    title: "Register Page v2",
    description:
      "A registration form with first name, last name, email, and password. There's an option to register with Google or GitHub and a link to login if you already have an account.",
    canonical: "/register/v2"
  });
}

export default function Page() {
  const firstId = useId();
  const lastId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  return (
    <div className="flex items-center justify-center py-4 lg:h-screen">
      <Card className="mx-auto w-96">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Account</CardTitle>
          <CardDescription>Enter your details below to create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={firstId}>First name</Label>
              <Input
                id={firstId}
                name="first_name"
                type="text"
                required
                className="w-full"
                placeholder="First name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={lastId}>Last name</Label>
              <Input
                id={lastId}
                name="last_name"
                type="text"
                required
                className="w-full"
                placeholder="Last name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={emailId}>Email</Label>
              <Input id={emailId} type="email" placeholder="contact@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={passwordId}>Password</Label>
              <Input id={passwordId} type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={confirmPasswordId}>Confirm Password</Label>
              <Input id={confirmPasswordId} type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>

            <div className="my-4">
              <div className="flex items-center gap-3">
                <div className="w-full border-t" />
                <span className="text-muted-foreground shrink-0 text-sm">or continue with</span>
                <div className="w-full border-t" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="w-full">
                <svg viewBox="0 0 24 24" aria-label="Google logo" role="img">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <GitHubLogoIcon />
                GitHub
              </Button>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/dashboard/login/v2" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
