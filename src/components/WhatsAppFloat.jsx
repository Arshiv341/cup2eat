import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BRAND } from '../theme/brand';

const WhatsAppFloat = () => {
  const getWhatsAppLink = () => {
    const phone = BRAND.contact.whatsappNumber;
    const message = encodeURIComponent(BRAND.whatsapp.defaultMessage);
    return `https://wa.me/${phone}?text=${message}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <a
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Cup2Eat on WhatsApp"
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:-translate-y-1 transition-all duration-200"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="font-semibold text-sm hidden sm:inline-block">
          Need Help? Chat with us
        </span>
      </a>
    </div>
  );
};

export default WhatsAppFloat;
