import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.memo(function Input({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s/g, '-');

  // Los inputs de fecha/hora muestran SIEMPRE su formato nativo (dd/mm/aaaa),
  // por eso su etiqueta debe quedar siempre arriba y no encimarse con el formato.
  const alwaysFloat = ['date', 'time', 'datetime-local', 'month', 'week'].includes(
    String(props.type)
  );
  const floated =
    focused || (props.value !== undefined && props.value !== '') || alwaysFloat;

  return (
    <div className="relative w-full">
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray pointer-events-none z-10">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          {...props}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          placeholder=" "
          className={[
            'w-full bg-charcoal-light/50 border rounded-sm px-4 pt-6 pb-2 text-cream font-body text-sm',
            'placeholder-transparent outline-none transition-all duration-200',
            'focus:border-gold focus:bg-charcoal-light/80',
            icon ? 'pl-10' : '',
            error ? 'border-terracotta' : 'border-charcoal',
            focused ? 'border-gold' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        <label
          htmlFor={inputId}
          className={[
            'absolute left-4 transition-all duration-200 pointer-events-none font-body',
            icon ? 'left-10' : '',
            floated
              ? 'top-2 text-xs text-gold'
              : 'top-1/2 -translate-y-1/2 text-sm text-warmgray',
          ].join(' ')}
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1 text-xs text-terracotta font-body animate-shake">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
