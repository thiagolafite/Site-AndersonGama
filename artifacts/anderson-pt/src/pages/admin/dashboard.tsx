import { useGetDashboardStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, MessageSquare, FileText, Mail, Activity } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-4xl text-white uppercase mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 bg-card rounded-xl" />)}
        </div>
      </div>
    );
  }

  // Fallback data if API returns empty/undefined in early dev
  const s = stats || {
    totalAppointments: 0,
    pendingAppointments: 0,
    totalTestimonials: 0,
    totalBlogPosts: 0,
    totalContacts: 0,
    unreadContacts: 0,
    appointmentsThisMonth: 0,
    contactsThisMonth: 0
  };

  return (
    <div>
      <h1 className="font-display text-4xl text-white uppercase mb-8">Visão Geral</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Agendamentos" 
          value={s.totalAppointments} 
          subtitle={`${s.pendingAppointments} pendentes`}
          icon={<CalendarDays className="text-primary" />}
        />
        <StatCard 
          title="Mensagens" 
          value={s.totalContacts} 
          subtitle={`${s.unreadContacts} não lidas`}
          icon={<Mail className="text-primary" />}
        />
        <StatCard 
          title="Depoimentos" 
          value={s.totalTestimonials} 
          icon={<MessageSquare className="text-primary" />}
        />
        <StatCard 
          title="Artigos no Blog" 
          value={s.totalBlogPosts} 
          icon={<FileText className="text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display tracking-widest text-xl uppercase text-white flex items-center gap-2">
              <Activity size={20} className="text-primary" /> Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-center py-12">
              Os dados de atividade recente aparecerão aqui.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: { title: string, value: number, subtitle?: string, icon: React.ReactNode }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-display text-white">{value}</div>
        {subtitle && <p className="text-xs text-primary mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
