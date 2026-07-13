import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { LayoutDashboard, Calendar, MessageSquare, FileText, Mail, LogOut, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border p-8 rounded-lg w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="font-display text-3xl text-white uppercase">Área Restrita</h1>
            <p className="text-muted-foreground mt-2">Acesso exclusivo do treinador</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Input 
                type="password" 
                placeholder="Senha de acesso" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background"
              />
              {error && <p className="text-destructive text-sm mt-2">Senha incorreta.</p>}
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
            <Button variant="ghost" asChild className="w-full text-muted-foreground">
              <Link href="/">Voltar para o site</Link>
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Agendamentos", path: "/admin/agendamentos", icon: <Calendar size={20} /> },
    { name: "Depoimentos", path: "/admin/depoimentos", icon: <MessageSquare size={20} /> },
    { name: "Blog", path: "/admin/blog", icon: <FileText size={20} /> },
    { name: "Contatos", path: "/admin/contatos", icon: <Mail size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex fixed h-full z-20">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-wider text-white">ANDERSON</span>
            <span className="font-display text-2xl font-bold text-primary">PT</span>
          </Link>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-colors",
                location === item.path 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary hover:text-white"
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={handleLogout}>
            <LogOut size={20} className="mr-3" /> Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
