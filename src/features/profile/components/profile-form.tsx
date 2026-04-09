"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { currentUser } from "@/lib/mock-data";
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

export function ProfileForm() {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser.name,
      nickname: currentUser.nickname,
      bio: currentUser.bio,
      roleInEvent: currentUser.roleInEvent,
    },
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success("Perfil atualizado. No Supabase real isso persiste no banco.");
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
