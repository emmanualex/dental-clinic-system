"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginFormState } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { KeyRound, Loader2, Siren } from "lucide-react";

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  );
}

export function LoginForm() {
  const initialState: LoginFormState = { success: false };
  const [state, formAction] = useFormState(login, initialState);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Admin Panel</CardTitle>
        <CardDescription>Please enter the password to access the admin dashboard.</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            aria-label="Password"
          />
          {state?.error && (
            <Alert variant="destructive">
              <Siren className="h-4 w-4" />
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <LoginButton />
        </CardFooter>
      </form>
    </Card>
  );
}
