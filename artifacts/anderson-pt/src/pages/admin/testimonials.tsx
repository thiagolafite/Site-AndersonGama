import { useListTestimonials, useDeleteTestimonial, useUpdateTestimonial } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListTestimonialsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Trash2, Star, CheckSquare } from "lucide-react";

export default function AdminTestimonials() {
  const queryClient = useQueryClient();
  const { data: testimonials, isLoading } = useListTestimonials();
  const deleteMutation = useDeleteTestimonial();
  const updateMutation = useUpdateTestimonial();

  const handleDelete = (id: number) => {
    if (confirm("Excluir este depoimento?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() })
      });
    }
  };

  const toggleFeatured = (id: number, currentFeatured: boolean) => {
    updateMutation.mutate({ id, data: { featured: !currentFeatured } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() })
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl text-white uppercase">Depoimentos</h1>
        <Button>Adicionar Novo</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">Carregando...</div>
        ) : testimonials?.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground bg-card rounded-lg border border-border">Nenhum depoimento cadastrado.</div>
        ) : (
          testimonials?.map(test => (
            <div key={test.id} className="bg-card border border-border rounded-lg p-6 flex flex-col relative">
              {test.featured && (
                <div className="absolute top-4 right-4 text-primary">
                  <Star fill="currentColor" size={20} />
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <h3 className="font-display text-lg text-white uppercase">{test.studentName}</h3>
                  <span className="text-xs text-primary uppercase tracking-wider">{test.goalType}</span>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm italic mb-6 flex-grow">"{test.content}"</p>
              
              <div className="flex justify-between items-center pt-4 border-t border-border mt-auto">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={test.featured ? "text-primary" : "text-muted-foreground"}
                  onClick={() => toggleFeatured(test.id, test.featured)}
                >
                  <Star size={16} className="mr-2" /> Destaque
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(test.id)}>
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
