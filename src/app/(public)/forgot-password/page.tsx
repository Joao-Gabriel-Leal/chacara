import { AuthCard } from "@/features/auth/components/auth-card";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10 md:px-6">
      <div className="w-full">
        <AuthCard
          title="Recuperar acesso"
          description="O fluxo usa o reset do Supabase Auth quando as credenciais reais estiverem configuradas."
        >
          <ForgotPasswordForm />
        </AuthCard>
      </div>
    </main>
  );
}
