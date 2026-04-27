import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, TrendingDown, Sparkles, BarChart3, Layers } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { useProblemStore } from "@/lib/problem-store";

const Index = () => {
  const setObjectiveType = useProblemStore((s) => s.setObjectiveType);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-hero opacity-90" />

          <div className="container relative py-20 md:py-28">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/80 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Programmation linéaire — Méthode du simplexe
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
                Optimisez vos décisions <br />
                <span className="text-gradient">financières & budgétaires</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Saisissez votre fonction objectif et vos contraintes sous forme d'équations.
                Obtenez la solution optimale instantanément.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant h-12 px-6"
                >
                  <Link to="/setup" onClick={() => setObjectiveType("max")}>
                    Commencer une optimisation
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-border-strong h-12 px-6 bg-surface/50 backdrop-blur"
                >
                  <a href="#types">Voir les types de problèmes</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Choix Max / Min */}
        <section id="types" className="container py-16 md:py-20">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold">
              Quel est votre type de problème&nbsp;?
            </h2>
            <p className="text-muted-foreground">
              Sélectionnez l'objectif d'optimisation pour commencer
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Maximisation */}
            <Link
              to="/setup"
              onClick={() => setObjectiveType("max")}
              className="group relative overflow-hidden rounded-2xl glass-panel p-8 hover:border-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-colors" />

              <div className="relative space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <TrendingUp className="h-6 w-6" strokeWidth={2.5} />
                </div>

                <div>
                  <div className="text-xs font-mono font-semibold text-primary uppercase tracking-wider mb-1">
                    Max Z
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Maximiser les profits</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Optimisez vos revenus, profits ou rendements en maximisant la fonction objectif tout en respectant vos contraintes budgétaires et de ressources.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-primary font-medium text-sm pt-2">
                  Configurer ce problème
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Minimisation */}
            <Link
              to="/setup"
              onClick={() => setObjectiveType("min")}
              className="group relative overflow-hidden rounded-2xl glass-panel p-8 hover:border-accent transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
            >
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-accent/20 blur-3xl group-hover:bg-accent/30 transition-colors" />

              <div className="relative space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-glow">
                  <TrendingDown className="h-6 w-6" strokeWidth={2.5} />
                </div>

                <div>
                  <div className="text-xs font-mono font-semibold text-accent uppercase tracking-wider mb-1">
                    Min Z
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Minimiser les pertes</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Réduisez vos coûts, dépenses ou pertes en minimisant la fonction objectif tout en garantissant le respect de vos contraintes opérationnelles minimales.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-accent font-medium text-sm pt-2">
                  Configurer ce problème
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="container pb-20">
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              {
                icon: Layers,
                title: "Saisie par équation",
                desc: "Tapez vos contraintes directement : 3x1 + 2x2 ≤ 18.",
              },
              {
                icon: BarChart3,
                title: "Résolution instantanée",
                desc: "Obtenez immédiatement la solution optimale et la valeur de Z.",
              },
              {
                icon: Sparkles,
                title: "Tableaux pédagogiques",
                desc: "Pivots, variables entrantes/sortantes et valeur de Z mis en évidence.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-surface/50 p-5 space-y-2"
              >
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-6">
        <div className="container text-center text-xs text-muted-foreground">
          Simplex Finance — Outil d'aide à la décision basé sur l'algorithme du simplexe
        </div>
      </footer>
    </div>
  );
};

export default Index;
