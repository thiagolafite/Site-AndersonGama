import { Link } from "wouter";
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <span className="font-display text-3xl font-bold tracking-wider text-white">ANDERSON</span>
              <span className="font-display text-3xl font-bold text-primary">PT</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Treinamento de alto rendimento. Transforme seu corpo com metodologia testada e resultados comprovados. Acompanhamento presencial e online.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.instagram.com/andersongama_personal/" target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xl mb-6 text-white tracking-widest">Links Rápidos</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Início</Link>
              </li>
              <li>
                <Link href="/agendamento" className="text-muted-foreground hover:text-primary transition-colors">Agendar Avaliação</Link>
              </li>
              <li>
                <Link href="/resultados" className="text-muted-foreground hover:text-primary transition-colors">Resultados</Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">Área Restrita</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-xl mb-6 text-white tracking-widest">Contato</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="text-primary shrink-0 mt-1" size={20} />
                <span>Engenho Velho, Brotas<br/>Salvador, Bahia</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="text-primary shrink-0" size={20} />
                <span>(71) 8784-1755</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="text-primary shrink-0" size={20} />
                <a href="mailto:Jbdsdj19@gmail.com" className="hover:text-primary transition-colors">Jbdsdj19@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Anderson Personal Trainer. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0">CREF 123456-G/SP</p>
        </div>
      </div>
    </footer>
  );
}
