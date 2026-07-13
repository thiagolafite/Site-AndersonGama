import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { useListTestimonials } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import before1 from "@assets/transformation-before-1.jpg";
import after1 from "@assets/transformation-after-1.jpg";
import { Dumbbell } from "lucide-react";

export default function Resultados() {
  const { data: testimonials, isLoading } = useListTestimonials();

  // Seeding some fake UI if API is empty for visual showcase
  const displayTestimonials = testimonials?.length ? testimonials : [
    {
      id: 1,
      studentName: "Carlos Silva",
      goalType: "emagrecimento",
      content: "Em 6 meses perdi 18kg e ganhei muita disposição. O treino é pesado, mas os resultados valem cada gota de suor. O Anderson não te deixa desistir.",
      weightLost: 18,
      duration: "6 meses",
      beforeImageUrl: before1,
      afterImageUrl: after1,
      featured: true,
      approved: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      studentName: "Marcos Paulo",
      goalType: "hipertrofia",
      content: "Sempre treinei fofo e não via resultado. Depois que comecei com o Anderson, ganhei 8kg de massa magra. A diferença está na correção do movimento.",
      weightLost: null,
      duration: "1 ano",
      beforeImageUrl: "",
      afterImageUrl: "",
      featured: false,
      approved: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      studentName: "Julia Costa",
      goalType: "condicionamento",
      content: "Treinos dinâmicos e focados. Melhorei minhas dores nas costas e hoje consigo correr 10km sem sofrer.",
      weightLost: 5,
      duration: "4 meses",
      beforeImageUrl: "",
      afterImageUrl: "",
      featured: false,
      approved: true,
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Subtle particle background across the whole page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleBackground opacity={0.35} intensity={0.7} />
      </div>
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative z-10">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-display text-white uppercase mb-4">Resultados</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              O sucesso deixa rastros. Veja a evolução de alunos que confiaram no processo e mudaram seus corpos.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-96 w-full rounded-lg bg-card border-border border" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayTestimonials.map((testimonial, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={testimonial.id} 
                  className={`bg-card border border-border rounded-lg overflow-hidden flex flex-col ${testimonial.featured ? 'md:col-span-2 lg:col-span-2 flex-col md:flex-row' : ''}`}
                >
                  {(testimonial.beforeImageUrl && testimonial.afterImageUrl) && (
                    <div className={`flex relative ${testimonial.featured ? 'md:w-1/2' : 'h-64'}`}>
                      <div className="w-1/2 relative border-r border-background">
                        <img src={testimonial.beforeImageUrl} alt="Antes" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 uppercase tracking-wider font-bold">Antes</span>
                      </div>
                      <div className="w-1/2 relative">
                        <img src={testimonial.afterImageUrl} alt="Depois" className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 right-2 bg-primary text-black text-xs px-2 py-1 uppercase tracking-wider font-bold">Depois</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 px-3 py-1 rounded-full">
                          {testimonial.goalType}
                        </span>
                        <span className="text-muted-foreground text-sm flex items-center gap-1">
                          <Dumbbell size={14}/> {testimonial.duration}
                        </span>
                      </div>
                      <p className="text-white text-lg mb-6 italic">"{testimonial.content}"</p>
                    </div>
                    
                    <div>
                      <h4 className="font-display text-xl uppercase">{testimonial.studentName}</h4>
                      {testimonial.weightLost && (
                        <p className="text-primary font-bold mt-1">-{testimonial.weightLost}kg</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
