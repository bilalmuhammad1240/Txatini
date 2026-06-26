import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  const steps: Record<string, unknown> = {};

  // PASSO 1 — Verificar variáveis de ambiente
  steps['1_env'] = {
    MPESA_ENV: process.env.MPESA_ENV ?? 'NÃO DEFINIDO',
    MPESA_SERVICE_PROVIDER_CODE: process.env.MPESA_SERVICE_PROVIDER_CODE ?? 'NÃO DEFINIDO',
    MPESA_API_KEY_length: process.env.MPESA_API_KEY?.length ?? 0,
    MPESA_PUBLIC_KEY_length: process.env.MPESA_PUBLIC_KEY?.length ?? 0,
    MPESA_API_KEY_preview: process.env.MPESA_API_KEY?.slice(0, 8) + '...',
    MPESA_PUBLIC_KEY_preview: process.env.MPESA_PUBLIC_KEY?.slice(0, 20) + '...',
  };

  // PASSO 2 — Formatar Public Key PEM
  let publicKeyPem = '';
  try {
    const raw = process.env.MPESA_PUBLIC_KEY ?? '';
    const clean = raw
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/\s+/g, '');
    const formatted = clean.match(/.{1,64}/g)?.join('\n') ?? clean;
    publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${formatted}\n-----END PUBLIC KEY-----`;
    steps['2_pem_format'] = {
      ok: true,
      clean_length: clean.length,
      pem_lines: publicKeyPem.split('\n').length,
      pem_preview: publicKeyPem.slice(0, 80) + '...',
    };
  } catch (err) {
    steps['2_pem_format'] = { ok: false, error: String(err) };
  }

  // PASSO 3 — Encriptar com RSA
  let bearerToken = '';
  try {
    const apiKey = process.env.MPESA_API_KEY ?? '';
    const encrypted = crypto.publicEncrypt(
      { key: publicKeyPem, padding: crypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(apiKey, 'utf8')
    );
    bearerToken = encrypted.toString('base64');
    steps['3_rsa_encrypt'] = {
      ok: true,
      token_length: bearerToken.length,
      token_preview: bearerToken.slice(0, 40) + '...',
    };
  } catch (err) {
    steps['3_rsa_encrypt'] = { ok: false, error: String(err) };
    return NextResponse.json({ steps }, { status: 200 });
  }

  // PASSO 4 — Chamar API M-Pesa C2B
  const env = process.env.MPESA_ENV ?? 'sandbox';
  const host = env === 'production' ? 'api.vm.co.mz' : 'api.sandbox.vm.co.mz';
  const url = `https://${host}:18352/ipg/v1x/c2bPayment/singleStage/`;

  // Sandbox: número de teste associado à tua conta no portal
  const testMsisdn = process.env.MPESA_TEST_PHONE ?? '258841511886';

  const body = {
    input_TransactionReference: 'T12344C',
    input_CustomerMSISDN: testMsisdn,
    input_Amount: '10',
    input_ThirdPartyReference: 'T12344C',
    input_ServiceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE ?? '',
  };

  steps['4_request'] = {
    url,
    body,
    note: 'input_TransactionReference e input_ThirdPartyReference max 20 chars, sem hífens',
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
        'Origin': 'developer.mpesa.vm.co.mz',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const responseText = await response.text();
    let responseJson: unknown = null;
    try { responseJson = JSON.parse(responseText); } catch { /* not json */ }

    steps['5_response'] = {
      http_status: response.status,
      http_status_text: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body_raw: responseText,
      body_parsed: responseJson,
    };
  } catch (err) {
    steps['5_response'] = {
      ok: false,
      error: String(err),
      type: err instanceof Error ? err.constructor.name : typeof err,
    };
  }

  return NextResponse.json({ steps }, { status: 200 });
}
