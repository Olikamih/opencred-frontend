import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "E-mail ou senha incorretos!");
      }

      const token = data?.access_token || data?.token;
      const userId = data?.userId || data?.user?.id || data?.id;

      if (!token) {
        throw new Error("Login feito, mas o backend não retornou token.");
      }

      if (!userId) {
        throw new Error("Login feito, mas o backend não retornou userId.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userId", String(userId));

      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "Erro ao conectar no servidor.");
    } finally {
      setLoading(false);
    }
  };

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

          <p className="mt-1 text-sm text-muted-foreground">
            Entre para ver seu score.
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="rounded-xl bg-destructive/15 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <Field
              icon={Mail}
              type="email"
              placeholder="seu@email.com"
              label="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Field
              icon={Lock}
              type="password"
              placeholder="••••••••"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 font-medium text-white shadow-glow transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Conectando..." : "Entrar"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link to="/register" className="font-medium text-gradient">
              Criar conta
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
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>

      <div className="glass flex items-center gap-3 rounded-xl px-4 py-3 focus-within:border-white/30">
        <Icon className="h-4 w-4 text-muted-foreground" />

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