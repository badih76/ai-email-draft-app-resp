'use client';

import { RegisterLink, LoginLink, LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button"; // Assuming Shadcn Button component is in place

export function KindeAuthButtons() {
  // Client component hook to check authentication status
  const { isAuthenticated } = useKindeBrowserClient();

  if (isAuthenticated) {
    // If logged in, show the Logout button
    return (
      <LogoutLink>
        <Button variant="ghost">
            Logout
        </Button>
      </LogoutLink>
    );
  }

  // If not logged in, show Login and Sign Up buttons
  return (
    <div className="flex items-center space-x-2">
        {/* Login using email, google, facebook, or github [cite: 15] */}
        <LoginLink authUrlParams={{ connection_id: 'google' }}>
            <Button variant="ghost">
                Login
            </Button>
        </LoginLink>
        
        {/* Sign-up using email, google, facebook, or github [cite: 18] */}
        <RegisterLink>
            <Button className="bg-sky-400 hover:bg-sky-500 text-white">
                Get Started
            </Button>
        </RegisterLink>
    </div>
  );
}