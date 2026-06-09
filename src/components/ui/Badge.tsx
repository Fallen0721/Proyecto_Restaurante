import React from 'react';

type BadgeVariant = 'gold' | 'terracotta' | 'dark' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: 'bg-gold/15 text-gold border border-gold/30',
  terracotta: 'bg-terracotta/15 text-terracotta border border-terracotta/30',
  dark: 'bg-charcoal-light text-warmgray border border-charcoal',
  outline: 'bg-transparent text-cream border border-warmgray/40',
};

const Badge = React.memo(function Badge({
  children,
  variant = 'gold',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 text-xs font-body tracking-wider rounded-sm',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
});

export default Badge;
