import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useGetBlogPost } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPostDetail() {
  const params = useParams();
  const id = Number(params.id);

  const { data: post, isLoading, error } = useGetBlogPost(id, {
    query: {
      enabled: !!id,
      queryKey: ['blog', id]
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-24 container max-w-4xl px-4">
          <Skeleton className="h-10 w-3/4 mb-6 bg-card" />
          <Skeleton className="h-6 w-1/4 mb-12 bg-card" />
          <Skeleton className="h-96 w-full mb-12 rounded-lg bg-card" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full bg-card" />
            <Skeleton className="h-4 w-full bg-card" />
            <Skeleton className="h-4 w-5/6 bg-card" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-display text-white uppercase mb-4">Artigo não encontrado</h1>
            <Button asChild>
              <Link href="/blog">Voltar para o Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <article className="container max-w-4xl px-4">
          <Button variant="ghost" asChild className="mb-8 -ml-4 text-muted-foreground hover:text-white">
            <Link href="/blog"><ArrowLeft size={16} className="mr-2" /> Voltar</Link>
          </Button>

          <header className="mb-12">
            <div className="flex items-center gap-4 text-sm text-primary uppercase tracking-widest font-semibold mb-4">
              <span className="flex items-center gap-1"><Tag size={14}/> {post.category}</span>
              <span className="text-muted-foreground">•</span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar size={14}/> {format(new Date(post.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display text-white uppercase leading-tight mb-6">
              {post.title}
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed border-l-4 border-primary pl-4">
              {post.excerpt}
            </p>
          </header>

          {post.imageUrl && (
            <div className="mb-16 rounded-xl overflow-hidden shadow-2xl border border-border">
              <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover" />
            </div>
          )}

          {/* Prose for blog content */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wide prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl">
            {/* We're simulating markdown/html rendering here. In a real app we might use react-markdown */}
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
