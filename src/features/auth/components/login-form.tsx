"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/features/auth/schemas";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "joaog@chacarahub.dev",
      password: "123456",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const supabase = createClient();

    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword(values);
      if (error) {
        toast.error(error.message);
        return;
      }
    } else {
      toast.success("Modo demo ativo. Entrando no dashboard com dados mockados.");
    }

    router.push("/dashboard");
  });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="voce@exemplo.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Sua senha" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full rounded-full bg-emerald-400 text-black hover:bg-emerald-300"
        >
          Entrar no hub
        </Button>
        <div className="flex items-center justify-between text-sm text-zinc-300">
          <Link href="/forgot-password" className="hover:text-white">
            Esqueci minha senha
          </Link>
          <Link href="/register" className="hover:text-white">
            Tenho convite
          </Link>
        </div>
      </form>
    </Form>
  );
}
