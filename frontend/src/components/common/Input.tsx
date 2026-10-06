import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 leading-none">{label}</label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors min-h-[48px]
          ${error
            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : 'border-gray-200 bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-50'
          }
          placeholder-gray-400 ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
export default Input;
