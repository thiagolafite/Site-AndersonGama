import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { MarqueeStrip } from "@/components/marquee-strip";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Activity, Apple, ArrowRight, CheckCircle2, Dumbbell, Flame, HeartPulse, Stethoscope } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import heroBg from "@assets/hero-bg.jpg";
import andersonProfile from "@assets/anderson-profile.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Gym Background" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <ParticleBackground opacity={0.9} intensity={1.2} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent z-10"></div>
        </div>

        <div className="container relative z-10 px-4 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h2 className="text-primary font-display tracking-[0.2em] text-lg md:text-xl mb-4 uppercase">Elite Personal Training</h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-white leading-[0.9] mb-6 uppercase">
              Transforme <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600">Seu Corpo</span><br/>
              E Sua Vida.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl font-light">
              Acompanhamento profissional com metodologia comprovada para hipertrofia, emagrecimento e performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-lg">
                <Link href="/agendamento">Agendar Avaliação Gratuita</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg">
                <a href="https://wa.me/557187841755" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <FaWhatsapp size={22} className="text-[#25D366]" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Strip */}
      <MarqueeStrip />

      {/* Services Section */}
      <section className="py-24 bg-card relative">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-primary font-display tracking-widest mb-2">METODOLOGIA E ÁREAS DE ATUAÇÃO</h2>
            <h3 className="text-4xl md:text-5xl font-display text-white uppercase">Especialidades</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard 
              icon={<Activity size={40} />}
              title="Reabilitação"
              desc="Treinamento especializado em prevenção de lesões, recuperação funcional, fortalecimento articular e ganho de mobilidade."
            />
            <ServiceCard 
              icon={<HeartPulse size={40} />}
              title="Sinais Vitais"
              desc="Acompanhamento contínuo dos parâmetros fisiológicos para garantir que cada treino seja executado com máxima segurança."
            />
            <ServiceCard 
              icon={<Stethoscope size={40} />}
              title="Aferição de P.A."
              desc="Monitoramento rigoroso da pressão arterial antes, durante e após os exercícios, oferecendo suporte total para hipertensos e grupos especiais."
            />
            <ServiceCard 
              icon={<Flame size={40} />}
              title="Especialista em Hipertrofia e Emagrecimento"
              desc="Protocolos estratégicos e individualizados para ganho de massa muscular magra e queima de gordura eficiente."
            />
            <ServiceCard 
              icon={<Apple size={40} />}
              title="Nutrição"
              desc="Orientação e estratégias de nutrição esportiva integradas para otimizar a regeneração muscular, energia e resultados estéticos."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="container px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="aspect-[4/5] relative rounded-lg overflow-hidden border-border">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10"></div>
                <img 
                  src={andersonProfile} 
                  alt="Anderson Personal Trainer" 
                  className="w-full h-full object-cover object-top hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card p-6 border border-border shadow-2xl rounded-lg max-w-[200px]">
                <p className="font-display text-4xl text-primary mb-1">16+</p>
                <p className="text-sm text-muted-foreground uppercase font-semibold tracking-wider">Anos de Experiência</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <h2 className="text-primary font-display tracking-widest mb-2">O TREINADOR</h2>
              <h3 className="text-4xl md:text-6xl font-display text-white mb-8 uppercase leading-tight">Quem é <br/>Anderson?</h3>
              
              <div className="space-y-6 text-muted-foreground text-lg mb-10">
                <p>
                  Sou formado em Educação Física com especialização em Fisiologia do Exercício, Hipertrofia e Emagrecimento. Nos últimos 16 anos, dediquei minha vida a entender como o corpo humano responde ao estímulo.
                </p>
                <p>
                  Meu objetivo não é apenas passar um treino, é construir resultados reais. Chega de treinos genéricos e promessas vazias. Aqui o trabalho é levado a sério.
                </p>
                <ul className="space-y-3 mt-6">
                  <li className="flex items-center gap-3 text-white"><CheckCircle2 className="text-primary" /> Especialista em Biomecânica</li>
                  <li className="flex items-center gap-3 text-white"><CheckCircle2 className="text-primary" /> Pós-graduado em Nutrição Esportiva</li>
                  <li className="flex items-center gap-3 text-white"><CheckCircle2 className="text-primary" /> Registro CREF: 123456-G/SP</li>
                </ul>
              </div>

              <Button size="lg" asChild>
                <Link href="/resultados">Ver Resultados dos Alunos <ArrowRight className="ml-2" size={20}/></Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Strip 2 — reversed, before CTA */}
      <MarqueeStrip
        phrases={["ELITE TRAINING","SUA MELHOR VERSÃO","SUPERE LIMITES","NUNCA DESISTA","CORPO E MENTE","8 ANOS DE EXPERIÊNCIA","RESULTADOS REAIS","MÉTODO COMPROVADO"]}
        reverse
        speed={50}
      />

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-display text-primary-foreground mb-6 uppercase">Pronto para a mudança?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Não deixe para amanhã o corpo que você pode começar a construir hoje. Agende uma avaliação gratuita e vamos traçar o melhor plano para você.
          </p>
          <Button size="lg" variant="secondary" className="text-lg bg-black text-white hover:bg-black/80" asChild>
            <Link href="/agendamento">Quero Começar Agora</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-background border border-border p-8 rounded-lg group transition-colors hover:border-primary/50"
    >
      <div className="text-primary mb-6 transition-transform group-hover:scale-110 origin-left">
        {icon}
      </div>
      <h4 className="text-2xl font-display text-white mb-4 uppercase">{title}</h4>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}
