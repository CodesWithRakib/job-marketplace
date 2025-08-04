import { LoginForm } from "@/components/auth/login-form";
import AuthLayout from "@/app/(auth)/layout";

export default function LoginPage() {
  return (
    <AuthLayout formType="login">
      <LoginForm />
    </AuthLayout>
  );
}
