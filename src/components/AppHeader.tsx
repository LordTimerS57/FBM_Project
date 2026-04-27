import { Sigma } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useApiStatusStore } from "@/lib/api-status-store";
import { useEffect } from "react";

export function AppHeader() {
  const { pathname } = useLocation();
  const { status, checkHealth } = useApiStatusStore();

  useEffect(() => {
    // Vérifier la connexion au chargement
    checkHealth();
    
    // Vérifier la connexion toutes les 30 secondes
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, [checkHealth]);

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-success";
      case "disconnected":
        return "bg-destructive";
      case "error":
        return "bg-warning";
      case "loading":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "connected":
        return "API connectée";
      case "disconnected":
        return "API déconnectée";
      case "error":
        return "Erreur API";
      case "loading":
        return "Vérification...";
      default:
        return "API";
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Sigma className="h-5 w-5" strokeWidth={2.5} />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight">Simplex Finance</span>
            <span className="text-[11px] font-medium text-muted-foreground">
              Optimisation budgétaire — méthode du simplexe
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {[
            { to: "/", label: "Accueil" },
            { to: "/setup", label: "Saisie" },
          ].map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  active
                    ? "bg-surface-elevated text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border ${
            status === "connected" ? "border-border-strong" : "border-destructive/50"
          } bg-surface px-3 py-1 text-[11px] font-medium ${
            status === "connected" ? "text-muted-foreground" : "text-destructive"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${getStatusColor()} ${
              status === "connected" ? "animate-pulse-glow" : ""
            }`} />
            {getStatusLabel()}
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
