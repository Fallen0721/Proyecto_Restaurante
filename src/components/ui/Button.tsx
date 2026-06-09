import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gold text-charcoal-deep font-semibold hover:bg-gold-dark transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,165,116,0.4)] active:scale-95',
  secondary:
    'bg-charcoal-light text-cream border border-gold/30 hover:border-gold hover:bg-charcoal transition-all duration-300',
  outline:
    'bg-transparent text-gold border border-gold hover:bg-gold/10 transition-all duration-300',
  ghost:
    'bg-transparent text-cream hover:text-gold transition-colors duration-300',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button = React.memo(function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 font-body tracking-wide rounded-sm',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        loading || disabled ? 'opacity-60 cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
});

export default Button;
