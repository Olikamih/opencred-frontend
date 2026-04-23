// Shared backend-aligned types (NestJS contract)

export type TransactionType = "entrada" | "saida";

export type InstitutionCategory = "bank_data" | "wallet" | "work_platform";

export interface Transaction {
  amount: number;
  type: TransactionType;
  institution_category: InstitutionCategory;
  institution_name: string;
  credit_score: number;
}

export interface Institution {
  institution_name: string;
  institution_category: InstitutionCategory;
  connected?: boolean;
}

export type WorkCategory = "driver" | "courier" | "freelancer" | "other";

export const WORK_CATEGORIES: { value: WorkCategory; label: string; emoji: string }[] = [
  { value: "driver", label: "Motorista de App", emoji: "🚗" },
  { value: "courier", label: "Entregador", emoji: "🛵" },
  { value: "freelancer", label: "Autônomo / MEI", emoji: "💼" },
  { value: "other", label: "Outros", emoji: "✨" },
];
