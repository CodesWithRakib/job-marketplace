import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Check Your Email</CardTitle>
          <CardDescription>
            We&apos;ve sent you an email with a confirmation link. Please click
            the link to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            If you don&apos;t see the email, check your spam folder or try
            resending it.
          </p>
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Register with Different Email</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
