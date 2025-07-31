import React from 'react';
import { cn } from '@/utils/common';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: { value: string | number; label: string }[];
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  placeholder,
  options,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={cn(
          'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm',
          error && 'border-error-500 focus:ring-error-500 focus:border-error-500',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options && options.length > 0 ? options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )) : (
          <option value="" disabled>검색 결과가 없습니다</option>
        )}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Select;
