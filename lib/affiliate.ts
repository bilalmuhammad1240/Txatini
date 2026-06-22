'use client';

const COOKIE_NAME = 'txatini_ref';
const COOKIE_DAYS = 30; // o código fica guardado 30 dias

/**
 * Guarda o código de afiliado num cookie persistente.
 * Chamado quando alguém abre o site com ?ref=CODIGO no URL.
 */
export function saveAffiliateCode(code: string): void {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(code)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

/**
 * Lê o código de afiliado guardado em cookie.
 * Devolvido no checkout para associar ao pedido.
 */
export function getAffiliateCode(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

/**
 * Remove o cookie de afiliado (após pedido criado com sucesso).
 */
export function clearAffiliateCode(): void {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
