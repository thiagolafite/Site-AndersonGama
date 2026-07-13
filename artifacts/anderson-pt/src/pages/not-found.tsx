import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
      <Dumbbell size={64} className="text-primary mb-6" />
      <h1 className="font-display text-8xl text-white mb-2">404</h1>
      <h2 className="font-display text-2xl text-muted-foreground uppercase tracking-widest mb-8">Página não encontrada</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        A página que você está procurando não existe ou foi movida. Volte ao treino e não perca o foco.
      </p>
      <Button asChild size="lg">
        <Link href="/">Voltar para o Início</Link>
      </Button>
    </div>
  );
}
