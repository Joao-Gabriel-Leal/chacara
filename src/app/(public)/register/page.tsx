import Link from "next/link";
import { AuthCard } from "@/features/auth/components/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 md:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <AuthCard
          title="Ativar convite"
          description="Cadastro fechado para convidados. O admin libera o codigo e voce cria sua conta em segundos."
        >
          <RegisterForm />
          <p className="mt-6 text-sm text-zinc-400">
            Ja esta dentro?{" "}
            <Link href="/login" className="text-white underline underline-offset-4">
              Fazer login
            </Link>
            .
          </p>
        </AuthCard>
        <section className="rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/70">Convites</p>
          <h2 className="mt-4 font-heading text-5xl font-semibold tracking-tight">
            Fluxo de cadastro sem bagunca.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["1", "Admin gera codigo", "Convites controlados pelo painel admin."],
              ["2", "Pessoa resgata", "Nome, e-mail e senha vinculados ao perfil."],
              ["3", "Hub desbloqueado", "Dashboard, galeria, quartos e financeiro liberados."],
            ].map(([step, title, description]) => (
              <div key={step} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <p className="font-heading text-3xl font-semibold text-emerald-200">{step}</p>
                <p className="mt-4 font-medium">{title}</p>
                <p className="mt-2 text-sm text-zinc-400">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
