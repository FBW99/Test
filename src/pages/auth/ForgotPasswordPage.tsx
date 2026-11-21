import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Enter your email address or username and we'll send recovery instructions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="space-y-4 text-center py-4">
              <CheckCircle2 className="h-10 w-10 text-[#166534] dark:text-[#4ADE80] mx-auto" />
              <p className="text-sm text-[#1F2937] dark:text-[#F1F5F2]">
                If an account matches <span className="font-semibold">{email}</span>, recovery instructions are on the way. You can return to Sign In anytime.
              </p>
              <Link to="/login" className="inline-block w-full">
                <Button className="w-full">Back to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="recoveryEmail">Email or Username</Label>
                <Input
                  id="recoveryEmail"
                  required
                  placeholder="e.g. customer@herbiz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#166534] dark:text-[#4ADE80] hover:underline"
                >
                  Return to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
