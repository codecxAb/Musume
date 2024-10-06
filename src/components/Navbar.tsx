"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Music } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="fixed w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Music className="h-8 w-8 text-violet-500" />
              <span className="ml-2 text-2xl font-bold text-white">Musume</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:bg-violet-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  {item.name}
                </Link>
              ))}
              <Button className="ml-4 bg-violet-600 hover:bg-violet-700 text-white">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-white">
                  <span className="sr-only">Open menu</span>
                  {isOpen ? (
                    <X className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-black/90 border-violet-700"
              >
                <nav className="flex flex-col h-full">
                  <div className="flex items-center mb-8">
                    <Music className="h-8 w-8 text-violet-500" />
                    <span className="ml-2 text-2xl font-bold text-white">
                      Musume
                    </span>
                  </div>
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-300 hover:bg-violet-700 hover:text-white px-3 py-2 rounded-md text-lg font-medium transition-colors duration-300 mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button
                    className="mt-4 bg-violet-600 hover:bg-violet-700 text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
