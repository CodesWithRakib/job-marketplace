import { RegisterForm } from "@/components/auth/register-form";
import AuthLayout from "@/app/(auth)/layout";

export default function RegisterPage() {
  return (
    <AuthLayout formType="register">
      <RegisterForm />
    </AuthLayout>
  );
}
