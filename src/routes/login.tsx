import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — OpenCred" },
      { name: "description", content: "Acesse sua conta OpenCred." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold">
            Open<span className="text-gradient">Cred</span>
          </span>
        </Link>

        <div className="glass-strong rounded-3xl p-8 shadow-glow-purple">
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
          <p className="mt-1 text-sm text-muted-foreground">Entre para ver seu score.</p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Field icon={Mail} type="email" placeholder="seu@email.com" label="E-mail" />
            <Field icon={Lock} type="password" placeholder="••••••••" label="Senha" />

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 font-medium text-white shadow-glow transition hover:opacity-90"
            >
              Entrar <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link to="/register" className="text-gradient font-medium">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, ...props }: { icon: typeof Mail; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <div className="glass flex items-center gap-3 rounded-xl px-4 py-3 focus-within:border-white/30">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input
          {...props}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </label>
  );
}
