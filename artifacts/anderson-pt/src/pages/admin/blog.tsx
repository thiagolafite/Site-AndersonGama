import { useListBlogPosts, useDeleteBlogPost } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListBlogPostsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminBlog() {
  const queryClient = useQueryClient();
  const { data: posts, isLoading } = useListBlogPosts();
  const deleteMutation = useDeleteBlogPost();

  const handleDelete = (id: number) => {
    if (confirm("Excluir este artigo?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListBlogPostsQueryKey() })
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl text-white uppercase">Artigos do Blog</h1>
        <Button><Plus size={18} className="mr-2" /> Novo Artigo</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando...</div>
        ) : posts?.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border text-muted-foreground">Nenhum artigo publicado.</div>
        ) : (
          posts?.map(post => (
            <div key={post.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt="" className="w-16 h-16 rounded object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded bg-secondary flex items-center justify-center text-xs text-muted-foreground">Sem img</div>
                )}
                <div>
                  <h3 className="font-display text-xl text-white uppercase">{post.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="uppercase text-primary">{post.category}</span>
                    <span>{format(new Date(post.createdAt), "dd/MM/yyyy")}</span>
                    {post.published ? (
                      <span className="text-green-500 flex items-center gap-1"><Eye size={12}/> Publicado</span>
                    ) : (
                      <span className="text-yellow-500 flex items-center gap-1"><EyeOff size={12}/> Rascunho</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit size={16} className="mr-2" /> Editar
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(post.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
