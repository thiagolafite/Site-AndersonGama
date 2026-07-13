import { Route, Switch, Router as WouterRouter } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';

// Pages
import Home from '@/pages/home';
import Agendamento from '@/pages/agendamento';
import Resultados from '@/pages/resultados';
import BlogList from '@/pages/blog';
import BlogPostDetail from '@/pages/blog-detail';

// Admin Pages
import AdminLayout from '@/pages/admin/layout';
import AdminDashboard from '@/pages/admin/dashboard';
import AdminAppointments from '@/pages/admin/appointments';
import AdminTestimonials from '@/pages/admin/testimonials';
import AdminBlog from '@/pages/admin/blog';
import AdminContacts from '@/pages/admin/contacts';

import NotFound from '@/pages/not-found';

import FloatingWhatsApp from '@/components/floating-whatsapp';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/agendamento" component={Agendamento} />
      <Route path="/resultados" component={Resultados} />
      <Route path="/blog" component={BlogList} />
      <Route path="/blog/:id" component={BlogPostDetail} />

      <Route path="/admin" nest>
        <AdminLayout>
          <Switch>
            <Route path="/" component={AdminDashboard} />
            <Route path="/agendamentos" component={AdminAppointments} />
            <Route path="/depoimentos" component={AdminTestimonials} />
            <Route path="/blog" component={AdminBlog} />
            <Route path="/contatos" component={AdminContacts} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="anderson-theme">
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
            <FloatingWhatsApp />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
