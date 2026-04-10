"use client";

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
import { inviteSchema } from "@/features/auth/schemas";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof inviteSchema>>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      inviteCode: "CHC-2026",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const supabase = createClient();

    if (supabase) {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.name,
            invite_code: values.inviteCode,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }
    }

    toast.success("Conta criada. Se o login nao entrar automatico, use a tela de login.");
    router.refresh();
    router.push("/login");
  });

  return (
    <Form {...form}>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="inviteCode"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Codigo do convite</FormLabel>
              <FormControl>
                <Input {...field} placeholder="CHC-2026" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Seu nome" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
            <FormItem className="md:col-span-2">
              <FormLabel>Crie sua senha</FormLabel>
              <FormControl>
                <Input {...field} type="password" placeholder="Minimo de 6 caracteres" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="md:col-span-2 rounded-full bg-emerald-400 text-black hover:bg-emerald-300"
        >
          Ativar convite
        </Button>
      </form>
    </Form>
  );
}
