import { NextRequest, NextResponse } from 'next/server';
import { initiateC2B } from '@/lib/mpesa';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, customerMsisdn, orderReference } = body;

    if (!orderId || !amount || !customerMsisdn || !orderReference) {
      return NextResponse.json(
        { error: 'Dados incompletos para iniciar pagamento.' },
        { status: 400 }
      );
    }

    // Iniciar pagamento M-Pesa
    console.log('[M-Pesa] Iniciando C2B:', {
      orderId,
      amount,
      msisdn: customerMsisdn,
      reference: `TXATINI-${orderReference}`.slice(0, 20),
      env: process.env.MPESA_ENV,
      hasApiKey: !!process.env.MPESA_API_KEY,
      hasPublicKey: !!process.env.MPESA_PUBLIC_KEY,
      hasProviderCode: !!process.env.MPESA_SERVICE_PROVIDER_CODE,
    });

    const result = await initiateC2B({
      amount: Number(amount),
      customerMsisdn: String(customerMsisdn),
      reference: `TXATINI${orderReference}`.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20),
      thirdPartyReference: orderId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20),
    });

    const supabase = await createClient();

    console.log('[M-Pesa] Resultado:', result);

    if (result.success) {
      // Pagamento iniciado com sucesso — actualizar pedido
      await supabase
        .from('orders')
        .update({
          payment_status: 'confirmado',
          mpesa_transaction_id: result.transactionId,
        })
        .eq('id', orderId);

      return NextResponse.json({
        success: true,
        message: result.responseDesc,
        transactionId: result.transactionId,
        conversationId: result.conversationId,
      });
    } else {
      // Falha — registar no pedido
      await supabase
        .from('orders')
        .update({ payment_status: 'falhado' })
        .eq('id', orderId);

      return NextResponse.json(
        {
          success: false,
          error: result.responseDesc,
          code: result.responseCode,
        },
        { status: 402 }
      );
    }
  } catch (err) {
    console.error('[API /mpesa-payment] Erro:', err);
    return NextResponse.json(
      { error: 'Erro inesperado ao processar pagamento.' },
      { status: 500 }
    );
  }
}
