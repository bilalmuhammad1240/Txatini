'use client';

import { buildGeneralWhatsAppMessage, buildWhatsAppLink } from '@/lib/whatsapp';

export default function WhatsAppButton() {
  const link = buildWhatsAppLink(buildGeneralWhatsAppMessage());

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 shrink-0"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.36a9.84 9.84 0 0 0 4.63 1.17h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2zm0 1.8c2.16 0 4.18.84 5.7 2.37a8.02 8.02 0 0 1 2.36 5.74c0 4.47-3.64 8.11-8.12 8.11a8.1 8.1 0 0 1-4.11-1.12l-.3-.17-3.03.77.81-2.95-.19-.31a8.06 8.06 0 0 1-1.24-4.33c0-4.48 3.65-8.11 8.12-8.11zm-4.5 4.5c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.69 2.7 4.16 3.69 2.06.82 2.48.66 2.93.62.45-.04 1.45-.59 1.65-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.45-.71-1.67-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.96-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42z" />
      </svg>
      <span className="hidden text-sm font-semibold sm:inline">
        Falar no WhatsApp
      </span>
    </a>
  );
}
