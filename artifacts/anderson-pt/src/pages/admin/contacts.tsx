import { useListContacts, useUpdateContact } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListContactsQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Mail, MailOpen, Phone } from "lucide-react";

export default function AdminContacts() {
  const queryClient = useQueryClient();
  const { data: contacts, isLoading } = useListContacts();
  const updateMutation = useUpdateContact();

  const markAsRead = (id: number) => {
    updateMutation.mutate({ id, data: { read: true } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListContactsQueryKey() })
    });
  };

  return (
    <div>
      <h1 className="font-display text-4xl text-white uppercase mb-8">Mensagens</h1>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando...</div>
        ) : contacts?.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border text-muted-foreground">Nenhuma mensagem recebida.</div>
        ) : (
          contacts?.map(contact => (
            <div 
              key={contact.id} 
              className={`bg-card border rounded-lg p-6 ${contact.read ? 'border-border opacity-70' : 'border-primary/50 shadow-md'}`}
              onClick={() => !contact.read && markAsRead(contact.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {contact.read ? <MailOpen className="text-muted-foreground" size={20} /> : <Mail className="text-primary" size={20} />}
                  <div>
                    <h3 className={`text-lg font-semibold ${contact.read ? 'text-muted-foreground' : 'text-white'}`}>{contact.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{contact.email}</span>
                      {contact.phone && <span className="flex items-center gap-1"><Phone size={12}/> {contact.phone}</span>}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{format(new Date(contact.createdAt), "dd/MM HH:mm")}</span>
              </div>
              
              <div className="bg-background rounded p-4 text-sm text-muted-foreground border border-border">
                {contact.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
