import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateTestimonial } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Star, MessageSquarePlus } from "lucide-react";

const schema = z.object({
  studentName: z.string().min(2, "Nome é obrigatório"),
  goalType: z.enum(["emagrecimento", "hipertrofia", "condicionamento", "iniciantes"], {
    required_error: "Selecione seu objetivo",
  }),
  content: z.string().min(20, "Conte um pouco mais — mínimo 20 caracteres"),
  duration: z.string().min(1, "Informe o tempo de treino"),
  weightLost: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function TestimonialForm() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const createTestimonial = useCreateTestimonial();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      studentName: "",
      goalType: undefined,
      content: "",
      duration: "",
      weightLost: "",
    },
  });

  function onSubmit(values: FormValues) {
    createTestimonial.mutate(
      {
        data: {
          studentName: values.studentName,
          goalType: values.goalType,
          content: values.content,
          duration: values.duration,
          weightLost: values.weightLost ? Number(values.weightLost) : undefined,
          approved: false,
        },
      },
      {
        onSuccess: () => setSubmitted(true),
        onError: () =>
          toast({
            title: "Erro ao enviar",
            description: "Ocorreu um problema. Tente novamente.",
            variant: "destructive",
          }),
      }
    );
  }

  return (
    <section className="py-24 bg-card border-t border-border relative overflow-hidden">
      {/* Decorative gold glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="container px-4 max-w-3xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-primary" size={40} />
              </div>
              <h3 className="text-3xl font-display text-white uppercase mb-3">
                Depoimento Enviado!
              </h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Obrigado por compartilhar sua história. Seu depoimento será revisado e publicado em breve.
              </p>
              <Button
                variant="outline"
                className="mt-8"
                onClick={() => { setSubmitted(false); form.reset(); }}
              >
                Enviar outro depoimento
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-primary font-display tracking-widest text-sm uppercase mb-2">
                  Compartilhe sua história
                </p>
                <h2 className="text-4xl md:text-5xl font-display text-white uppercase leading-tight">
                  Deixe seu<br />Depoimento
                </h2>
                <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                  Sua transformação pode inspirar outras pessoas. Conte como foi sua experiência e os resultados que você alcançou.
                </p>
              </div>

              {/* Form card */}
              <div className="bg-background border border-border rounded-lg p-6 md:p-10 shadow-2xl">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="studentName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white uppercase tracking-wider text-xs font-semibold">
                              Seu nome
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Nome completo" className="bg-card" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="goalType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white uppercase tracking-wider text-xs font-semibold">
                              Objetivo
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-card">
                                  <SelectValue placeholder="Qual foi seu foco?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                                <SelectItem value="emagrecimento">Emagrecimento</SelectItem>
                                <SelectItem value="condicionamento">Condicionamento Físico</SelectItem>
                                <SelectItem value="iniciantes">Iniciante</SelectItem>
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
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white uppercase tracking-wider text-xs font-semibold">
                              Tempo de treino
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: 6 meses, 1 ano…" className="bg-card" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="weightLost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white uppercase tracking-wider text-xs font-semibold">
                              Kg perdidos <span className="text-muted-foreground normal-case font-normal">(opcional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="Ex: 12"
                                className="bg-card"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white uppercase tracking-wider text-xs font-semibold">
                            Seu depoimento
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Conte como foi sua jornada, os desafios superados e os resultados que você conquistou…"
                              className="bg-card resize-none"
                              rows={5}
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
                      className="w-full h-14 text-base gap-2"
                      disabled={createTestimonial.isPending}
                    >
                      {createTestimonial.isPending ? (
                        "Enviando…"
                      ) : (
                        <>
                          <MessageSquarePlus size={20} />
                          Enviar Depoimento
                        </>
                      )}
                    </Button>

                    <p className="text-center text-muted-foreground text-xs">
                      Seu depoimento será revisado antes de ser publicado.
                    </p>
                  </form>
                </Form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
