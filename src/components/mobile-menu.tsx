"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  user: any; // Using any for simplicity as User type is complex, but could be typed better
}

export function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden mr-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-[73px] left-0 right-0 bg-white border-b shadow-lg z-50 p-4 flex flex-col gap-4 animate-in slide-in-from-top-5 duration-200">
          <Link
            href="/"
            className="text-sm font-medium hover:text-indigo-600 py-2 border-b border-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          {user?.id ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-indigo-600 py-2 border-b border-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-300 py-2 border-b border-gray-100 cursor-not-allowed">
              Dashboard
            </span>
          )}
          <Link
            href="/plans"
            className="text-sm font-medium hover:text-indigo-600 py-2 border-b border-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link>
        </div>
      )}
    </div>
  );
}
