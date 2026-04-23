import type { Institution, Transaction } from "./types";

export const MOCK_SCORE = 782;
export const MOCK_LIMIT = 8450;

export const MOCK_INSTITUTIONS: Institution[] = [
  { institution_name: "Uber", institution_category: "work_platform", connected: true },
  { institution_name: "iFood", institution_category: "work_platform", connected: true },
  { institution_name: "99", institution_category: "work_platform" },
  { institution_name: "Rappi", institution_category: "work_platform" },
  { institution_name: "Nubank", institution_category: "bank_data", connected: true },
  { institution_name: "Itaú", institution_category: "bank_data" },
  { institution_name: "Bradesco", institution_category: "bank_data" },
  { institution_name: "Mercado Pago", institution_category: "wallet", connected: true },
  { institution_name: "PicPay", institution_category: "wallet" },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    amount: 312.5,
    type: "entrada",
    institution_category: "work_platform",
    institution_name: "Uber",
    credit_score: 782,
  },
  {
    amount: 184.2,
    type: "entrada",
    institution_category: "work_platform",
    institution_name: "iFood",
    credit_score: 782,
  },
  {
    amount: 89.9,
    type: "saida",
    institution_category: "wallet",
    institution_name: "Mercado Pago",
    credit_score: 782,
  },
  {
    amount: 540.0,
    type: "entrada",
    institution_category: "bank_data",
    institution_name: "Nubank",
    credit_score: 782,
  },
  {
    amount: 220.75,
    type: "saida",
    institution_category: "bank_data",
    institution_name: "Nubank",
    credit_score: 782,
  },
];

export const MOCK_MONTHLY_EARNINGS = [
  { month: "Mai", amount: 3120 },
  { month: "Jun", amount: 3580 },
  { month: "Jul", amount: 4120 },
  { month: "Ago", amount: 3890 },
  { month: "Set", amount: 4640 },
  { month: "Out", amount: 5210 },
];
