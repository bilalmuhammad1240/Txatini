export type OrderStatus = 'pendente' | 'em_preparacao' | 'entregue';
export type DeliveryType = 'entrega' | 'recolha';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null; // pode ficar null se o produto for apagado depois
  product_name: string; // snapshot do nome no momento da compra
  quantity: number;
  price: number; // preço unitário no momento da compra
}

export interface Order {
  id: string;
  user_name: string;
  phone: string;
  location: string;
  delivery_type: DeliveryType;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items?: OrderItem[];
}

export interface NewOrderInput {
  user_name: string;
  phone: string;
  location: string;
  delivery_type: DeliveryType;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
}
