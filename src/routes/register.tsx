import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Sparkles, Check } from "lucide-react";
import { WORK_CATEGORIES, type WorkCategory } from "@/lib/types";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Criar conta — OpenCred" },
      { name: "description", content: "Crie sua conta OpenCred e descubra seu score." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [category, setCategory] = useState<WorkCategory>("driver");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold">
            Open<span className="text-gradient">Cred</span>
          </span>
        </Link>

        <div className="glass-strong rounded-3xl p-8 shadow-glow-purple">
          <h1 className="text-2xl font-bold">Criar sua conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Em 2 minutos você descobre seu Score OpenCred.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
            }}
          >
            <Field icon={User} placeholder="Como você se chama?" label="Nome" />
            <Field icon={Mail} type="email" placeholder="seu@email.com" label="E-mail" />
            <Field icon={Lock} type="password" placeholder="••••••••" label="Senha" />

            <div>
              <span className="mb-2 block text-xs font-medium text-muted-foreground">
                Categoria de trabalho
              </span>
              <div className="grid grid-cols-2 gap-2">
                {WORK_CATEGORIES.map((cat) => {
                  const active = category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={`group relative flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm transition ${
                        active
                          ? "border-transparent bg-gradient-primary text-white shadow-glow"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="font-medium">{cat.label}</span>
                      {active && <Check className="ml-auto h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 font-medium text-white shadow-glow transition hover:opacity-90"
            >
              Criar conta e simular score <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="text-gradient font-medium">
              Entrar
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
