"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setPasswordsMatch(password === retypePassword);
  }, [password, retypePassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/auth/signin"); // Redirect to sign-in page
    } else {
      console.error("Failed to register");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative overflow-hidden flex items-center justify-center">
      {/* Star background */}
      <div className="absolute inset-0 z-0">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      <Card className="w-full max-w-md bg-gray-900/80 border-purple-500 backdrop-blur-sm relative z-10">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Music className="h-12 w-12 text-purple-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-purple-300">
            Sign up for Musume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Retype Password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className={`bg-gray-800 border-gray-700 text-white placeholder-gray-400 ${
                  !passwordsMatch && retypePassword ? "border-red-500" : ""
                }`}
                required
              />
              {!passwordsMatch && retypePassword && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" /> Passwords do not
                  match
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading || !passwordsMatch}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing Up...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          {error && (
            <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
          )}
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-purple-400 hover:text-purple-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
