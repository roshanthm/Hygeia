import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glass = false }) => (
  <div className={`rounded-3xl p-6 ${glass ? 'glass-card' : 'bg-white shadow-md border border-slate-100'} ${className}`}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'glass';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', loading, className = '', ...props }) => {
  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm backdrop-blur-sm',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-sm',
    outline: 'bg-transparent border border-slate-300 text-slate-700 hover:border-teal-500 hover:text-teal-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    glass: 'glass text-teal-800 hover:bg-white/40 border border-white/50 backdrop-blur-md shadow-sm'
  };

  return (
    <button
      className={`px-5 py-2.5 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'danger' | 'warning' | 'info' | 'glass' }> = ({ children, variant = 'info' }) => {
  const variants = {
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    glass: 'bg-white/30 text-slate-800 border border-white/40 backdrop-blur-sm shadow-sm'
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${variants[variant]}`}>
      {children}
    </span>
  );
};
