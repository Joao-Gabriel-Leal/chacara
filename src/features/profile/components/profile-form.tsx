"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createClient } from "@/lib/supabase/browser";
import { AppProfile } from "@/types/domain";
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
import { Textarea } from "@/components/ui/textarea";
import { profileSchema } from "@/features/auth/schemas";

export function ProfileForm({ profile }: { profile: AppProfile }) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      nickname: profile.nickname,
      bio: profile.bio,
      roleInEvent: profile.roleInEvent,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const supabase = createClient();

    if (!supabase) {
      toast.success("Perfil atualizado no modo demo.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: values.name,
        nickname: values.nickname,
        bio: values.bio,
        role_in_event: values.roleInEvent,
      })
      .eq("id", profile.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Perfil atualizado com sucesso.");
  });

  return (
    <Form {...form}>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apelido</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roleInEvent"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Funcao no role</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Bio curta</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="md:col-span-2 rounded-full bg-emerald-400 text-black hover:bg-emerald-300"
        >
          Salvar perfil
        </Button>
      </form>
    </Form>
  );
}
