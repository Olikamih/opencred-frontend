import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Check,
  Car,
  Bike,
  Briefcase,
  MoreHorizontal,
} from "lucide-react";

import type { WorkCategory } from "@/lib/types";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Criar conta — OpenCred" },
      {
        name: "description",
        content: "Crie sua conta OpenCred e descubra seu score.",
      },
    ],
  }),
  component: RegisterPage,
});

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const WORK_CATEGORIES: {
  value: WorkCategory;
  label: string;
  Icon: React.ElementType;
}[] = [
  { value: "driver", label: "Motorista de App", Icon: Car },
  { value: "courier", label: "Entregador", Icon: Bike },
  { value: "freelancer", label: "Autônomo / MEI", Icon: Briefcase },
  { value: "other", label: "Outros", Icon: MoreHorizontal },
];

function RegisterPage() {
  const navigate = useNavigate();

  const [full_name, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [category, setCategory] = React.useState<WorkCategory>("driver");

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: full_name.trim(),
          email: email.trim(),
          password,
          category,
          platform_origin: "web",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Erro ao criar conta. Este e-mail já está em uso?"
        );
      }

      navigate({ to: "/login" });
    } catch (err: any) {
      setError(err?.message || "Erro ao conectar no servidor.");
    } finally {
      setLoading(false);
    }
  };

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

          <form className="mt-8 space-y-4" onSubmit={handleRegister}>
            {error && (
              <div className="rounded-xl bg-destructive/15 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <Field
              icon={User}
              label="Nome"
              placeholder="Como você se chama?"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Field
              icon={Mail}
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Field
              icon={Lock}
              type="password"
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div>
              <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Categoria de trabalho
              </span>

              <div className="grid grid-cols-2 gap-2">
                {WORK_CATEGORIES.map(({ value, label, Icon }) => {
                  const active = category === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCategory(value)}
                      className={`relative flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left text-sm transition ${
                        active
                          ? "border-transparent bg-gradient-primary text-white shadow-glow"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                          active ? "bg-white/20" : "bg-white/10"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>

                      <span className="font-medium leading-tight">{label}</span>

                      {active && <Check className="ml-auto h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Criando conta..." : "Criar conta e simular score"}

              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="font-medium text-gradient">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  ...props
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>

      <div className="glass flex items-center gap-3 rounded-xl px-4 py-3 transition focus-within:border-white/30">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />

        <input
          {...props}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
      </div>
    </label>
  );
}