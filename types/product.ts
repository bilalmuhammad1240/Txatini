export type ProductCategory =
  | 'tempero'
  | 'marinada'
  | 'especiaria'
  | 'condimento'
  | 'outro';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number; // em MZN
  image_url: string | null;
  category: ProductCategory;
  stock: number;
  active: boolean;
  created_at: string;
}

export interface NewProduct {
  name: string;
  description: string;
  price: number;
  image_url?: string | null;
  category: ProductCategory;
  stock: number;
  active: boolean;
}
