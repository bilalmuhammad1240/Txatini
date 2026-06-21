import { CartItem } from '@/types/cart';
import { DeliveryType } from '@/types/order';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '258000000000';

/**
 * Gera o link "click-to-chat" do WhatsApp com mensagem pré-preenchida.
 */
export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

/**
 * Mensagem para um pedido completo feito via checkout do site.
 */
export function buildOrderMessage(params: {
  name: string;
  phone: string;
  location: string;
  deliveryType: DeliveryType;
  items: CartItem[];
  total: number;
}): string {
  const { name, phone, location, deliveryType, items, total } = params;

  const itemLines = items
    .map((item) => `- ${item.product.name} x${item.quantity}`)
    .join('\n');

  const deliveryLabel = deliveryType === 'entrega' ? 'Entrega' : 'Recolha na loja';

  return `Novo pedido - Txatiní

Cliente: ${name}
Telefone: ${phone}

Produtos:
${itemLines}

Total: ${total} MZN

Localização: ${location}
Tipo: ${deliveryLabel}

Confirmar pedido?`;
}

/**
 * Mensagem para "Comprar no WhatsApp" direto a partir da página de um produto
 * (sem passar pelo carrinho/checkout).
 */
export function buildDirectProductMessage(productName: string, price: number): string {
  return `Olá! Quero encomendar:

- ${productName} (${price} MZN)

Podem confirmar disponibilidade e entrega?`;
}

export function buildGeneralWhatsAppMessage(): string {
  return 'Olá! Gostaria de saber mais sobre os temperos Txatiní.';
}
