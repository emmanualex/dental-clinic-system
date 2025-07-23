"use client";

import { logout } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button variant="outline" size="icon">
        <LogOut />
        <span className="sr-only">Logout</span>
      </Button>
    </form>
  )
}
