import { type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'accent';
  padding?: 'none' | 'sm' | 'md';
}

const paddings = { none: '', sm: 'p-3', md: 'p-4' };

export default function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  const base = 'bg-white rounded-2xl border border-gray-100';
  const shadow = variant === 'flat' ? '' : 'shadow-sm';
  const accent = variant === 'accent' ? 'border-l-4 border-l-emerald-600' : '';
  return (
    <div className={`${base} ${shadow} ${accent} ${paddings[padding]} ${className}`} {...props}>
      {children}
    </div>
  );
}
