import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-white/5">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Open<span className="text-gradient">Cred</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">
              Home
            </Link>
            <Link to="/dashboard" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">
              Dashboard
            </Link>
            <Link to="/connect" activeProps={{ className: "text-foreground" }} className="hover:text-foreground transition">
              Conectar
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-white shadow-glow hover:opacity-90 transition"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
