import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateAppointment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { useState } from "react";
import { CalendarDays, Clock, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  phone: z.string().min(8, "Telefone inválido"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  goal: z.enum(["emagrecimento", "hipertrofia", "condicionamento", "iniciantes", "outro"]),
  desiredDate: z.string().min(1, "Data é obrigatória"),
  desiredTime: z.string().min(1, "Horário é obrigatório"),
  notes: z.string().optional(),
});

export default function Agendamento() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const createAppointment = useCreateAppointment();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      goal: "hipertrofia",
      desiredDate: "",
      desiredTime: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createAppointment.mutate(
      { data: { ...values, email: values.email || "não informado" } as any },
      {
        onSuccess: () => {
          setIsSuccess(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        onError: () => {
          toast({
            title: "Erro ao agendar",
            description: "Ocorreu um erro ao enviar sua solicitação. Tente novamente.",
            variant: "destructive",
          });
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Subtle particle background across the whole page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleBackground opacity={0.35} intensity={0.7} />
      </div>
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative z-10">
        <div className="container max-w-4xl px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-display text-white uppercase mb-4">Agendar Avaliação</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Dê o primeiro passo. Preencha o formulário abaixo para agendarmos uma avaliação gratuita e discutirmos seu plano de treinamento.
            </p>
          </div>

          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border p-12 rounded-lg text-center"
            >
              <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-display text-white uppercase mb-4">Solicitação Enviada!</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Recebemos seus dados. Em breve entrarei em contato para confirmar o agendamento.
              </p>
              <Button asChild size="lg" className="text-lg">
                <a 
                  href={`https://wa.me/5511999999999?text=Ol%C3%A1%20Anderson!%20Acabei%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20pelo%20site.`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Confirmar via WhatsApp
                </a>
              </Button>
            </motion.div>
          ) : (
            <div className="bg-card border border-border p-6 md:p-10 rounded-lg shadow-xl">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white uppercase tracking-wider font-semibold">Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} className="bg-background" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white uppercase tracking-wider font-semibold">WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 99999-9999" {...field} className="bg-background" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white uppercase tracking-wider font-semibold">E-mail (Opcional)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="seu@email.com" {...field} className="bg-background" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white uppercase tracking-wider font-semibold">Objetivo Principal</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Selecione um objetivo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                              <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                              <SelectItem value="condicionamento">Condicionamento Físico</SelectItem>
                              <SelectItem value="iniciantes">Sou Iniciante</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="desiredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white uppercase tracking-wider font-semibold flex items-center gap-2"><CalendarDays size={16}/> Data Desejada</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="bg-background" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="desiredTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white uppercase tracking-wider font-semibold flex items-center gap-2"><Clock size={16}/> Horário Desejado</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} className="bg-background" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white uppercase tracking-wider font-semibold">Observações (Lesões, histórico, etc)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva brevemente seu histórico de treino ou restrições..." 
                            className="bg-background resize-none" 
                            rows={4}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full text-lg h-14" 
                    disabled={createAppointment.isPending}
                  >
                    {createAppointment.isPending ? "Enviando..." : "Solicitar Agendamento"}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
