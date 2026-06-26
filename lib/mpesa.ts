import crypto from 'crypto';

// =============================================
// CONFIGURAÇÃO
// =============================================
const MPESA_API_KEY = process.env.MPESA_API_KEY!;
const MPESA_PUBLIC_KEY = process.env.MPESA_PUBLIC_KEY!;
const MPESA_SERVICE_PROVIDER_CODE = process.env.MPESA_SERVICE_PROVIDER_CODE!;
const MPESA_ENV = process.env.MPESA_ENV || 'sandbox';

const API_HOST =
  MPESA_ENV === 'production'
    ? 'api.vm.co.mz'
    : 'api.sandbox.vm.co.mz';

const API_PORT = 18352;

// =============================================
// AUTENTICAÇÃO — RSA PKCS1 v1.5 com Public Key
// A chave precisa de estar formatada com quebras de linha a cada 64 chars
// =============================================
function generateBearerToken(): string {
  // Limpar a chave — remover espaços, newlines, e headers se existirem
  const cleanKey = MPESA_PUBLIC_KEY
    .replace(/-----BEGIN PUBLIC KEY-----/g, '')
    .replace(/-----END PUBLIC KEY-----/g, '')
    .replace(/\s+/g, '');

  // Reformatar com quebras de linha a cada 64 caracteres (formato PEM padrão)
  const formattedKey = cleanKey.match(/.{1,64}/g)?.join('\n') ?? cleanKey;
  const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${formattedKey}\n-----END PUBLIC KEY-----`;

  try {
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKeyPem,
        padding: crypto.constants.RSA_PKCS1_PADDING, // M-Pesa usa PKCS1 v1.5, não OAEP
      },
      Buffer.from(MPESA_API_KEY, 'utf8')
    );

    return encrypted.toString('base64');
  } catch (err) {
    throw new Error(`Erro RSA: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// =============================================
// TIPOS
// =============================================
export interface MpesaC2BParams {
  amount: number;           // valor em MZN
  customerMsisdn: string;   // número do cliente ex: 258840000000
  reference: string;        // referência do pedido ex: "TXATINI-001"
  thirdPartyReference: string; // referência única ex: UUID do pedido
}

export interface MpesaResponse {
  success: boolean;
  responseCode: string;     // INS-0 = sucesso
  responseDesc: string;
  transactionId?: string;
  conversationId?: string;
  thirdPartyReference?: string;
  rawError?: string;
}

// Códigos de resposta M-Pesa Mozambique
const RESPONSE_MESSAGES: Record<string, string> = {
  'INS-0': 'Pagamento efectuado com sucesso.',
  'INS-1': 'Erro interno. Tenta novamente.',
  'INS-2': 'Erro de mapeamento.',
  'INS-5': 'Saldo insuficiente.',
  'INS-6': 'Transação falhou.',
  'INS-9': 'Pedido de pagamento em timeout. Tenta novamente.',
  'INS-10': 'Valor duplicado.',
  'INS-13': 'Código de agente inválido.',
  'INS-14': 'Token inválido. Verifica as credenciais.',
  'INS-15': 'Problema de cobrança.',
  'INS-16': 'Transação cancelada pelo utilizador.',
  'INS-17': 'Transação falhou — tenta novamente.',
  'INS-18': 'Número inválido.',
  'INS-19': 'Valor fora dos limites.',
  'INS-20': 'Dados inválidos.',
  'INS-21': 'Não autorizado.',
  'INS-22': 'Outro erro.',
  'INS-23': 'Valor inválido.',
  'INS-24': 'Dados em falta.',
  'INS-25': 'Erro de sistema.',
  'INS-26': 'Não autorizado.',
  'INS-993': 'PIN incorreto ou expirado.',
  'INS-994': 'Número não registado no M-Pesa.',
  'INS-995': 'Conta bloqueada.',
  'INS-996': 'Conta não activa.',
  'INS-997': 'Pedido de link em curso.',
  'INS-998': 'Conta não encontrada.',
  'INS-2006': 'Encriptação inválida.',
  'INS-2057': 'Idioma inválido.',
};

// =============================================
// C2B — Customer to Business (cliente paga à loja)
// =============================================
export async function initiateC2B(params: MpesaC2BParams): Promise<MpesaResponse> {
  const { amount, customerMsisdn, reference, thirdPartyReference } = params;

  // Formatar número: garantir que começa com 258
  const formattedMsisdn = customerMsisdn.startsWith('258')
    ? customerMsisdn.replace(/\s+/g, '')
    : `258${customerMsisdn.replace(/^0/, '').replace(/\s+/g, '')}`;

  // Referências: só alfanumérico, max 20 chars
  const cleanReference = reference.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
  const cleanThirdParty = thirdPartyReference.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);

  let bearerToken: string;
  try {
    bearerToken = generateBearerToken();
  } catch (err) {
    console.error('[M-Pesa] Erro ao gerar token RSA:', err);
    return {
      success: false,
      responseCode: 'TOKEN_ERROR',
      responseDesc: 'Não foi possível autenticar com o M-Pesa.',
      rawError: String(err),
    };
  }

  const url = `https://${API_HOST}:${API_PORT}/ipg/v1x/c2bPayment/singleStage/`;

  const body = {
    input_TransactionReference: cleanReference,
    input_CustomerMSISDN: formattedMsisdn,
    input_Amount: String(Math.round(amount)),
    input_ThirdPartyReference: cleanThirdParty,
    input_ServiceProviderCode: MPESA_SERVICE_PROVIDER_CODE,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
        'Origin': 'developer.mpesa.vm.co.mz',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    const responseCode = data.output_ResponseCode || 'UNKNOWN';
    const responseDesc =
      RESPONSE_MESSAGES[responseCode] ||
      data.output_ResponseDesc ||
      'Resposta desconhecida do M-Pesa.';

    const success = responseCode === 'INS-0';

    return {
      success,
      responseCode,
      responseDesc,
      transactionId: data.output_TransactionID,
      conversationId: data.output_ConversationID,
      thirdPartyReference: data.output_ThirdPartyReference,
    };
  } catch (err) {
    console.error('[M-Pesa] Erro na chamada C2B:', err);
    return {
      success: false,
      responseCode: 'NETWORK_ERROR',
      responseDesc: 'Não foi possível contactar o M-Pesa. Verifica a ligação e tenta novamente.',
      rawError: String(err),
    };
  }
}
