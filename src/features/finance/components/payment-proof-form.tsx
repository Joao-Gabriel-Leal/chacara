"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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

export function PaymentProofForm() {
  const form = useForm<z.infer<typeof paymentProofSchema>>({
    resolver: zodResolver(paymentProofSchema),
    defaultValues: {
      amount: 120,
      note: "",
    },
  });

  const onSubmit = form.handleSubmit(() => {
    toast.success(
      "Comprovante enviado no modo demo. Conecte o bucket payment-proofs para persistir.",
    );
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
          <Input type="file" />
          <p className="text-xs text-zinc-400">
            O bucket `payment-proofs` foi previsto para guardar o arquivo original.
          </p>
        </div>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observacao</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} placeholder="PIX da conta conjunta" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full rounded-full bg-white text-black hover:bg-zinc-200"
        >
          Ja paguei
        </Button>
      </form>
    </Form>
  );
}
