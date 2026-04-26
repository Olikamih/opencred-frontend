 README — Frontend (OpenCred)

```md
# OpenCred - Frontend

## 📌 Sobre o Projeto

O OpenCred é uma plataforma web de análise de crédito e gestão financeira.

Este repositório contém o frontend responsável pela experiência visual do usuário, oferecendo dashboard financeiro, autenticação, visualização de score e acompanhamento de movimentações.

A proposta é entregar uma experiência moderna, rápida e intuitiva.

---

# 🎯 Problema

Usuários possuem dificuldade em visualizar sua saúde financeira de forma clara.

O mercado oferece soluções complexas, pouco intuitivas e com baixa transparência.

Nosso objetivo é simplificar essa experiência.

---

# 👥 Público-Alvo

- usuários comuns
- pequenos empreendedores
- jovens adultos
- pessoas buscando organização financeira
- usuários em busca de crédito

---

# 🚀 Solução

Uma plataforma com:

- login e cadastro
- dashboard moderno
- score financeiro visual
- saldo atualizado
- créditos disponíveis
- histórico de transações

---

# ✨ Diferenciais

- experiência visual moderna
- interface intuitiva
- acesso rápido às informações
- responsividade
- integração com API REST
- preparado para deploy em produção

---

# 🏗 Arquitetura

```text
Frontend (React + Vite)
        ↓
Backend API (NestJS)
        ↓
PostgreSQL
⚙ Tecnologias Utilizadas
Frontend
React
Vite
TypeScript
TailwindCSS
TanStack Router
Lucide Icons
Recharts
Vercel (Deploy)
📁 Estrutura
src/
├── components/
├── routes/
├── hooks/
├── services/
├── lib/
📊 Dashboard

O sistema apresenta:

score financeiro
saldo atual
créditos disponíveis
gráfico de ganhos
últimas movimentações
histórico financeiro
▶ Como Executar
1. Clone
git clone <repositorio>
cd opencred-frontend
2. Instale dependências
npm install
3. Configure .env
VITE_API_URL=
4. Execute
npm run dev
☁ Deploy

Deploy realizado com:

Vercel (Frontend)
🔗 Integração com API

O frontend consome a API REST do backend para:

autenticação
dashboard
score
transações
perfil do usuário

Utilizando JWT Token para segurança.

📱 Responsividade

A interface foi desenvolvida com foco em:

desktop
tablet
mobile
⚠ Limitações
dados simulados em algumas áreas
sem integração bancária real
sem notificações push
🔮 Melhorias Futuras
dashboard avançado
notificações em tempo real
análise preditiva
Open Finance
integração com bancos
relatórios inteligentes
🎥 Pitch

O frontend foi pensado para demonstrar visualmente:

valor da solução
facilidade de uso
diferencial competitivo
experiência do usuário
👨‍💻 Equipe

Projeto acadêmico desenvolvido para apresentação prática.

OpenCred © 2026