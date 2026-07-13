import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ParticleBackground } from "@/components/particle-background";
import { MarqueeStrip } from "@/components/marquee-strip";
import { useListBlogPosts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CATEGORIES = ["Todos", "Treino", "Alimentação", "Emagrecimento", "Hipertrofia", "Saúde"];

export default function BlogList() {
  const [search] = useSearch();
  const searchParams = new URLSearchParams(search);
  const currentCategory = searchParams.get("category")?.toLowerCase() || "";

  const { data: posts, isLoading } = useListBlogPosts({ 
    category: currentCategory !== "todos" ? currentCategory : undefined,
    published: true 
  });

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Subtle particle background across the whole page */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ParticleBackground opacity={0.35} intensity={0.7} />
      </div>
      <Navbar />

      <main className="flex-grow pt-32 pb-24 relative z-10">
        <MarqueeStrip className="mb-12" speed={55} />
        <div className="container px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-display text-white uppercase mb-4">Blog</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
              Conteúdo técnico, dicas de treino e nutrição para potencializar seus resultados.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map(cat => {
                const slug = cat.toLowerCase();
                const isActive = slug === "todos" ? !currentCategory : currentCategory === slug;
                const href = slug === "todos" ? "/blog" : `/blog?category=${slug}`;
                
                return (
                  <Button 
                    key={cat}
                    asChild 
                    variant={isActive ? "default" : "outline"}
                    className="rounded-full uppercase tracking-wider text-xs"
                  >
                    <Link href={href}>{cat}</Link>
                  </Button>
                )
              })}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-lg bg-card" />
                  <Skeleton className="h-6 w-3/4 bg-card" />
                  <Skeleton className="h-20 w-full bg-card" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts && posts.length > 0 ? (
                posts.map(post => (
                  <article key={post.id} className="group flex flex-col">
                    <Link href={`/blog/${post.id}`} className="block mb-6 overflow-hidden rounded-lg aspect-video bg-card">
                      {post.imageUrl ? (
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <span className="font-display text-4xl text-muted-foreground opacity-30 uppercase tracking-widest">Anderson PT</span>
                        </div>
                      )}
                    </Link>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest mb-3 font-semibold">
                      <span className="text-primary">{post.category}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(post.createdAt), "dd MMM yyyy", { locale: ptBR })}
                      </span>
                    </div>
                    
                    <Link href={`/blog/${post.id}`}>
                      <h2 className="text-2xl font-display text-white mb-3 group-hover:text-primary transition-colors leading-tight uppercase">
                        {post.title}
                      </h2>
                    </Link>
                    
                    <p className="text-muted-foreground mb-6 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <Link href={`/blog/${post.id}`} className="inline-flex items-center text-primary font-bold uppercase tracking-wider text-sm hover:text-white transition-colors mt-auto">
                      Ler Artigo <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </article>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-card rounded-lg border border-border">
                  <h3 className="text-2xl font-display text-white uppercase mb-2">Nenhum artigo encontrado</h3>
                  <p className="text-muted-foreground">Não há publicações nesta categoria no momento.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
