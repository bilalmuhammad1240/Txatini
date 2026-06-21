import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { NewOrderInput } from '@/types/order';

export async function POST(request: NextRequest) {
  try {
    const body: NewOrderInput = await request.json();

    const { user_name, phone, location, delivery_type, items } = body;

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

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_name,
        phone,
        location,
        delivery_type,
        total,
        status: 'pendente',
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Erro ao criar pedido:', orderError);
      return NextResponse.json(
        { error: 'Não foi possível criar o pedido.' },
        { status: 500 }
      );
    }

    const orderItemsPayload = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error('Erro ao criar itens do pedido:', itemsError);
      return NextResponse.json(
        { error: 'Não foi possível guardar os itens do pedido.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('Erro inesperado ao criar pedido:', err);
    return NextResponse.json(
      { error: 'Erro inesperado ao criar o pedido.' },
      { status: 500 }
    );
  }
}
