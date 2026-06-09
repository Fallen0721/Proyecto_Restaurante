import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  icon?: React.ReactNode;
}

const Select = React.memo(function Select({
  label,
  options,
  error,
  icon,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s/g, '-');

  return (
    <div className="relative w-full">
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warmgray pointer-events-none z-10">
            {icon}
          </span>
        )}
        <select
          id={selectId}
          {...props}
          className={[
            'w-full bg-charcoal-light/50 border rounded-sm px-4 pt-6 pb-2 text-cream font-body text-sm',
            'outline-none transition-all duration-200 appearance-none cursor-pointer',
            'focus:border-gold focus:bg-charcoal-light/80',
            icon ? 'pl-10' : '',
            error ? 'border-terracotta' : 'border-charcoal',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <option value="" disabled>
            Seleccionar
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-charcoal text-cream">
              {opt.label}
            </option>
          ))}
        </select>
        <label
          htmlFor={selectId}
          className={[
            'absolute top-2 text-xs text-gold font-body pointer-events-none transition-all duration-200',
            icon ? 'left-10' : 'left-4',
          ].join(' ')}
        >
          {label}
        </label>
        {/* Flecha decorativa */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-warmgray">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      {error && (
        <p className="mt-1 text-xs text-terracotta font-body">{error}</p>
      )}
    </div>
  );
});

export default Select;
