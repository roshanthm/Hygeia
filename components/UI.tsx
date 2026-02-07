
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', glass = false }) => (
  <div className={`rounded-[2.5rem] p-8 ${glass ? 'glass shadow-2xl shadow-slate-200/50' : 'bg-white shadow-xl shadow-slate-100 border border-slate-50'} ${className}`}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', loading, className = '', ...props }) => {
  const variants = {
    primary: 'bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/20',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/20',
    outline: 'bg-white border-2 border-slate-100 text-slate-700 hover:border-teal-500 hover:text-teal-600 shadow-sm',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20'
  };

  return (
    <button 
      className={`px-8 py-4 rounded-2xl font-black transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 tracking-tight ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      ) : children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'danger' | 'warning' | 'info' }> = ({ children, variant = 'info' }) => {
  const variants = {
    success: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
    danger: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
    warning: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
    info: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.1em] ${variants[variant]}`}>
      {children}
    </span>
  );
};
