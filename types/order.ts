export type OrderStatus = 'pendente' | 'em_preparacao' | 'entregue';
export type DeliveryType = 'entrega' | 'recolha';
export type PaymentMethod = 'whatsapp' | 'mpesa';
export type PaymentStatus = 'pendente' | 'confirmado' | 'falhado';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user_name: string;
  phone: string;
  location: string;
  delivery_type: DeliveryType;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  mpesa_number: string | null;
  payment_status: PaymentStatus;
  affiliate_code: string | null;
  commission_amount: number | null;
  created_at: string;
  order_items?: OrderItem[];
}

export interface NewOrderInput {
  user_name: string;
  phone: string;
  location: string;
  delivery_type: DeliveryType;
  payment_method: PaymentMethod;
  mpesa_number?: string;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
}
