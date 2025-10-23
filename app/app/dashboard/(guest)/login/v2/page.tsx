"use client";

import { useId, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/providers/auth-provider";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const emailId = useId();
  const passwordId = useId();
  const roleId = useId();
  const router = useRouter();
  const { setToken } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "admin" as "admin" | "manager" | "employee"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-login for demo purposes
  useEffect(() => {
    const autoLogin = () => {
      const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NjExMjI4OTYsImV4cCI6MTc2MTIwOTI5Nn0.CtMbQvgRRMw98-2TvbzS7dWhNP3tZvYzdHB7dE0r8wY";
      setToken(testToken);
      localStorage.setItem("auth_token", testToken);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", "test@example.com");
      localStorage.setItem("userRole", "admin");
      document.cookie = `user_role=admin; path=/; max-age=86400`;
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = "/dashboard/admin/home";
      }, 1000);
    };

    // Auto-login after 2 seconds
    const timer = setTimeout(autoLogin, 2000);
    return () => clearTimeout(timer);
  }, [setToken]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // For demo purposes, accept any email/password combination
      if (formData.email && formData.password) {
        // Generate a test JWT token (in real app, this would come from API)
        const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NjExMjI4OTYsImV4cCI6MTc2MTIwOTI5Nn0.CtMbQvgRRMw98-2TvbzS7dWhNP3tZvYzdHB7dE0r8wY";
        
        // Set JWT token in auth context
        setToken(testToken);
        
        // Set user role cookie (for middleware)
        document.cookie = `user_role=${formData.role}; path=/; max-age=86400`;
        
        // Store login state
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userRole", formData.role);
        
        // Redirect to dashboard
        window.location.href = `/dashboard/${formData.role}/home`;
      } else {
        setError("Please fill in all fields");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Simulate social login
    setIsLoading(true);
    setTimeout(() => {
      // Generate a test JWT token
      const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NjExMjI4OTYsImV4cCI6MTc2MTIwOTI5Nn0.CtMbQvgRRMw98-2TvbzS7dWhNP3tZvYzdHB7dE0r8wY";
      
      // Set JWT token in auth context
      setToken(testToken);
      
      // Set user role cookie
      document.cookie = `user_role=${formData.role}; path=/; max-age=86400`;
      
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", `user@${provider}.com`);
      localStorage.setItem("userRole", formData.role);
      
      // Redirect to dashboard
      window.location.href = `/dashboard/${formData.role}/home`;
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center py-4 lg:h-screen">
      <Card className="mx-auto w-96">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor={roleId}>Login As</Label>
              <select
                id={roleId}
                name="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                disabled={isLoading}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="admin">🔧 Admin - Full Access</option>
                <option value="manager">👔 Manager - Team Management</option>
                <option value="employee">👤 Employee - Standard Access</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor={emailId}>Email</Label>
              <Input 
                id={emailId} 
                name="email"
                type="email" 
                placeholder="contact@example.com" 
                required 
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor={passwordId}>Password</Label>
                <Link
                  href="/dashboard/forgot-password"
                  className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id={passwordId} 
                name="password"
                type="password" 
                required 
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="my-4">
              <div className="flex items-center gap-3">
                <div className="w-full border-t" />
                <span className="text-muted-foreground shrink-0 text-sm">or continue with</span>
                <div className="w-full border-t" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button 
                type="button"
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading}
              >
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
                {isLoading ? "Logging in..." : "Google"}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                className="w-full"
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading}
              >
                <GitHubLogoIcon />
                {isLoading ? "Logging in..." : "GitHub"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/dashboard/register/v2" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
