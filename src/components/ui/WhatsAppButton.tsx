import { MessageCircle } from 'lucide-react';
import { classNames, getWhatsAppLink } from '@/utils/helpers';
import type { ButtonHTMLAttributes } from 'react';

interface WhatsAppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  phone: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const sizeMap = {
  sm: 'h-10 px-4 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-[15px] gap-2 rounded-xl',
  lg: 'h-13 px-6 text-base gap-2 rounded-xl',
};

export function WhatsAppButton({
  phone,
  name,
  size = 'md',
  fullWidth = false,
  className,
  ...props
}: WhatsAppButtonProps) {
  const message = name
    ? `Hola ${name}, te contacto a través de Ayuda Colombia. Necesito ayuda.`
    : 'Hola, te contacto a través de Ayuda Colombia.';

  return (
    <a
      href={getWhatsAppLink(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      className={classNames(
        'inline-flex items-center justify-center font-semibold whitespace-nowrap',
        'bg-available-600 text-white hover:bg-available-700 active:bg-available-800',
        'transition-all duration-200 active:scale-[0.98]',
        sizeMap[size],
        fullWidth && 'w-full',
        className,
      )}
      aria-label={`Contactar a ${name || 'esta persona'} por WhatsApp`}
      {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
    >
      <MessageCircle className="h-[18px] w-[18px] flex-shrink-0" />
      <span>Contactar por WhatsApp</span>
    </a>
  );
}
