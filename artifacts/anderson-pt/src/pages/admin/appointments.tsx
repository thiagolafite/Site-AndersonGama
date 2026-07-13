import { useListAppointments, useUpdateAppointment, useDeleteAppointment } from "@workspace/api-client-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getListAppointmentsQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Trash2 } from "lucide-react";

export default function AdminAppointments() {
  const queryClient = useQueryClient();
  const { data: appointments, isLoading } = useListAppointments();
  const updateMutation = useUpdateAppointment();
  const deleteMutation = useDeleteAppointment();

  const handleStatusUpdate = (id: number, status: 'confirmed' | 'cancelled') => {
    updateMutation.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
        }
      });
    }
  };

  const statusMap = {
    pending: { label: "Pendente", class: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50" },
    confirmed: { label: "Confirmado", class: "bg-green-500/20 text-green-500 border-green-500/50" },
    cancelled: { label: "Cancelado", class: "bg-red-500/20 text-red-500 border-red-500/50" }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-4xl text-white uppercase">Agendamentos</h1>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow className="border-border hover:bg-secondary">
              <TableHead className="text-white">Data / Hora</TableHead>
              <TableHead className="text-white">Aluno</TableHead>
              <TableHead className="text-white">Objetivo</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Carregando...</TableCell>
              </TableRow>
            ) : appointments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum agendamento encontrado.</TableCell>
              </TableRow>
            ) : (
              appointments?.map((app) => (
                <TableRow key={app.id} className="border-border">
                  <TableCell className="font-medium">
                    {format(new Date(app.desiredDate), "dd/MM/yyyy")} às {app.desiredTime}
                  </TableCell>
                  <TableCell>
                    <div>{app.name}</div>
                    <div className="text-xs text-muted-foreground">{app.phone}</div>
                  </TableCell>
                  <TableCell className="uppercase text-xs tracking-wider">{app.goal}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusMap[app.status as keyof typeof statusMap].class}>
                      {statusMap[app.status as keyof typeof statusMap].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {app.status === 'pending' && (
                      <>
                        <Button size="icon" variant="ghost" className="text-green-500 hover:text-green-400 hover:bg-green-500/10" onClick={() => handleStatusUpdate(app.id, 'confirmed')}>
                          <Check size={18} />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => handleStatusUpdate(app.id, 'cancelled')}>
                          <X size={18} />
                        </Button>
                      </>
                    )}
                    <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(app.id)}>
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

