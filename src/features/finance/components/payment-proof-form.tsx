"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { paymentProofSchema } from "@/features/auth/schemas";

export function PaymentProofForm({
  currentUserId,
  pixInstructions,
}: {
  currentUserId?: string;
  pixInstructions?: string | null;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof paymentProofSchema>>({
    resolver: zodResolver(paymentProofSchema),
    defaultValues: {
      amount: 120,
      note: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const supabase = createClient();

    if (!supabase || !currentUserId) {
      toast.error("Sessao ou Supabase indisponivel.");
      return;
    }

    if (!file) {
      toast.error("Anexe o comprovante antes de enviar.");
      return;
    }

    const extension = file.name.split(".").pop() ?? "jpg";
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const safeName = baseName.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
    const filePath = `${currentUserId}/${file.lastModified}-${file.size}-${safeName}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error(uploadError.message);
      return;
    }

    const { error } = await supabase.from("payment_submissions").insert({
      user_id: currentUserId,
      amount: values.amount,
      status: "pending",
      proof_path: filePath,
      note: values.note || null,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Comprovante enviado para aprovacao do admin.");
    form.reset({ amount: values.amount, note: "" });
    setFile(null);
    startTransition(() => router.refresh());
  });

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor pago</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min="1"
                  step="0.01"
                  onChange={(event) => field.onChange(Number(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Anexar comprovante</FormLabel>
          <Input type="file" accept="image/*,.pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          <p className="text-xs text-zinc-400">
            O arquivo vai para o bucket privado `payment-proofs`.
          </p>
        </div>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observacao</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} placeholder="Enviei pelo PIX da conta conjunta" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {pixInstructions ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-zinc-300">
            {pixInstructions}
          </div>
        ) : null}
        <Button
          type="submit"
          className="w-full rounded-full bg-white text-black hover:bg-zinc-200"
          disabled={isPending}
        >
          Ja paguei
        </Button>
      </form>
    </Form>
  );
}
