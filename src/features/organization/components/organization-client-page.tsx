"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/browser";
import { getPlanningData } from "@/lib/services/planning";

const categories = ["comidas", "bebidas", "utensilios", "quartos", "transporte", "mercado"] as const;

export function OrganizationClientPage({
  initialData,
  isAdmin,
}: {
  initialData: Awaited<ReturnType<typeof getPlanningData>>;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function createPlanningItem(formData: FormData) {
    const supabase = createClient();
    if (!supabase) {
      toast.error("Supabase indisponivel.");
      return;
    }

    const { error } = await supabase.from("planning_items").insert({
      name: String(formData.get("name") ?? ""),
      category: String(formData.get("category") ?? "comidas"),
      quantity: String(formData.get("quantity") ?? ""),
      responsible_user_id: String(formData.get("responsible_user_id") ?? "") || null,
      note: String(formData.get("note") ?? ""),
      status: "pending",
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Item cadastrado.");
    startTransition(() => router.refresh());
  }

  async function toggleItem(itemId: string, status: "pending" | "bought") {
    const supabase = createClient();
    if (!supabase) {
      toast.error("Supabase indisponivel.");
      return;
    }

    const { error } = await supabase
      .from("planning_items")
      .update({ status })
      .eq("id", itemId);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Status atualizado.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Organizacao"
        title="Tudo que o grupo precisa levar ou resolver"
        description="Cadastro real de itens, responsaveis e status."
      />

      {isAdmin ? (
        <form action={createPlanningItem} className="grid gap-3 rounded-[28px] border border-white/10 bg-white/5 p-5 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input name="name" placeholder="Carvao" />
          </div>
          <div className="space-y-2">
            <Label>Categoria</Label>
            <select name="category" className="flex h-10 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Quantidade</Label>
            <Input name="quantity" placeholder="4 sacos" />
          </div>
          <div className="space-y-2">
            <Label>Responsavel</Label>
            <select name="responsible_user_id" className="flex h-10 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm">
              <option value="">Nao definido</option>
              {initialData.participants.map((participant) => (
                <option key={participant.id} value={participant.id}>
                  {participant.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Observacao</Label>
            <Textarea name="note" rows={2} placeholder="Detalhes do item" />
          </div>
          <Button type="submit" className="md:col-span-3 rounded-full bg-emerald-400 text-black hover:bg-emerald-300">
            <Plus className="mr-2 size-4" />
            Cadastrar item
          </Button>
        </form>
      ) : null}

      <Tabs defaultValue="comidas" className="space-y-4">
        <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-[24px] border border-white/10 bg-white/5 p-1 md:grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="rounded-[18px] capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {initialData.items
                .filter((item) => item.category === category)
                .map((item) => (
                  <div key={item.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-heading text-2xl font-semibold">{item.name}</p>
                        <p className="mt-1 text-sm text-zinc-400">{item.quantity}</p>
                      </div>
                      <Badge className="rounded-full bg-white/10 capitalize text-white">
                        {item.status}
                      </Badge>
                    </div>
                    <div className="mt-4 space-y-3 text-sm text-zinc-300">
                      <p>Responsavel: {item.responsible}</p>
                      <p>Observacao: {item.note}</p>
                    </div>
                    <div className="mt-5 flex gap-2">
                      <Button
                        size="sm"
                        className="rounded-full bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/25"
                        onClick={() => toggleItem(item.id, "bought")}
                        disabled={isPending}
                      >
                        <CheckCircle2 className="mr-1 size-3" />
                        Comprado
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-white/10 bg-black/20 text-white"
                        onClick={() => toggleItem(item.id, "pending")}
                        disabled={isPending}
                      >
                        <ShoppingCart className="mr-1 size-3" />
                        Pendente
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
