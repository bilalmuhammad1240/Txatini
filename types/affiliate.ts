export type AffiliateStatus = 'pendente' | 'ativo' | 'suspenso';
export type CommissionStatus = 'pendente' | 'pago';

export interface Affiliate {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  code: string;
  commission_pct: number;
  status: AffiliateStatus;
  notes: string | null;
  created_at: string;
}

export interface Commission {
  id: string;
  affiliate_id: string;
  order_id: string;
  order_total: number;
  commission_pct: number;
  commission_amount: number;
  status: CommissionStatus;
  created_at: string;
}

export interface NewAffiliateInput {
  name: string;
  phone: string;
  email?: string;
  code: string;
}
