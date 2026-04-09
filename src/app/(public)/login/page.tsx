import Link from "next/link";
import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10 md:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[1fr_0.85fr]">
        <section className="rounded-[36px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-200/70">Login</p>
          <h1 className="mt-4 font-heading text-5xl font-semibold tracking-tight">
            Entre para ver tudo que o grupo precisa.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-zinc-300">
            Dashboard pessoal, comprovantes, mural, quartos, enquetes e os jogos da chacara em uma experiencia premium.
          </p>
          <div className="mt-8 rounded-[28px] border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-zinc-300">
              No modo demo, o app entra direto no dashboard mesmo sem Supabase configurado.
            </p>
          </div>
        </section>
        <AuthCard
          title="Acessar conta"
          description="Use seu e-mail e senha. Se estiver no modo local, a experiencia demo continua funcionando."
        >
          <LoginForm />
          <p className="mt-6 text-sm text-zinc-400">
            Ainda nao tem conta?{" "}
            <Link href="/register" className="text-white underline underline-offset-4">
              Ative com convite
            </Link>
            .
          </p>
        </AuthCard>
      </div>
    </main>
  );
}
