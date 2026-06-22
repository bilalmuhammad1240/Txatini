import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { NewOrderInput } from '@/types/order';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body: NewOrderInput & { affiliate_code?: string } = await request.json();
    const { user_name, phone, location, delivery_type, items, affiliate_code } = body;

    if (!user_name || !phone || !location || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Dados do pedido incompletos.' },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const supabase = await createClient();
    const orderId = randomUUID();

    // Verificar se o código de afiliado é válido e está ativo
    let validAffiliateCode: string | null = null;
    let commissionAmount: number | null = null;
    let commissionPct: number | null = null;
    let affiliateId: string | null = null;

    if (affiliate_code) {
      const { data: affiliate } = await supabase
        .from('affiliates')
        .select('id, code, commission_pct, status')
        .eq('code', affiliate_code.toUpperCase())
        .eq('status', 'ativo')
        .single();

      if (affiliate) {
        validAffiliateCode = affiliate.code;
        commissionPct = affiliate.commission_pct;
        commissionAmount = Math.round((total * affiliate.commission_pct) / 100 * 100) / 100;
        affiliateId = affiliate.id;
      }
    }

    // Criar pedido
    const { error: orderError } = await supabase.from('orders').insert({
      id: orderId,
      user_name,
      phone,
      location,
      delivery_type,
      total,
      status: 'pendente',
      affiliate_code: validAffiliateCode,
      commission_amount: commissionAmount,
    });

    if (orderError) {
      console.error('Erro ao criar pedido:', orderError);
      return NextResponse.json(
        { error: 'Não foi possível criar o pedido.', details: orderError.message },
        { status: 500 }
      );
    }

    // Criar itens do pedido
    const orderItemsPayload = items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error('Erro ao criar itens:', itemsError);
      return NextResponse.json(
        { error: 'Não foi possível guardar os itens do pedido.', details: itemsError.message },
        { status: 500 }
      );
    }

    // Registar comissão se houver afiliado válido
    if (affiliateId && commissionAmount !== null && commissionPct !== null) {
      await supabase.from('commissions').insert({
        affiliate_id: affiliateId,
        order_id: orderId,
        order_total: total,
        commission_pct: commissionPct,
        commission_amount: commissionAmount,
        status: 'pendente',
      });
    }

    return NextResponse.json(
      { order: { id: orderId }, affiliate_code: validAffiliateCode },
      { status: 201 }
    );
  } catch (err) {
    console.error('Erro inesperado:', err);
    return NextResponse.json(
      { error: 'Erro inesperado ao criar o pedido.' },
      { status: 500 }
    );
  }
}
