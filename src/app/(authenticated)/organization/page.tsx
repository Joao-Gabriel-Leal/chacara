import { CheckCircle2, ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { planningItems } from "@/lib/mock-data";

const categories = [
  "comidas",
  "bebidas",
  "utensilios",
  "quartos",
  "transporte",
  "mercado",
] as const;

export default function OrganizationPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Organizacao"
        title="Tudo que o grupo precisa levar ou resolver"
        description="Comidas, bebidas, utensilios, transporte, mercado e quartos com responsavel, status e observacao."
      />

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
              {planningItems
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
                      <Badge className="rounded-full bg-emerald-400/15 text-emerald-100">
                        <CheckCircle2 className="mr-1 size-3" />
                        Marcar comprado
                      </Badge>
                      <Badge className="rounded-full bg-black/20 text-white">
                        <ShoppingCart className="mr-1 size-3" />
                        Pendente
                      </Badge>
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
