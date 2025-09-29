import React from 'react';
import clsx from 'clsx';

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
};
export const Button: React.FC<BtnProps> = ({ className, variant='primary', ...p }) => {
  const base = 'px-3 py-2 rounded-lg transition focus:outline-none focus:ring-2 text-sm';
  const map: Record<NonNullable<BtnProps['variant']>, string> = {
    primary:  'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300 disabled:opacity-50',
    secondary:'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-300 disabled:opacity-50',
    danger:   'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300 disabled:opacity-50',
    ghost:    'bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-300',
  };
  return <button {...p} className={clsx(base, map[variant], className)} />;
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...p }) => (
  <input {...p} className={clsx('px-3 py-2 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-300', className)} />
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, ...p }) => (
  <select {...p} className={clsx('px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300', className)} />
);

export const Card: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className, children }) => (
  <div className={clsx('rounded-xl border p-4 bg-white text-black shadow-sm', className)}>{children}</div>
);

export const Badge: React.FC<{ color?: 'gray'|'blue'|'green'|'red'|'amber'; children?: React.ReactNode }> = ({ color='gray', children }) => {
  const map: Record<string,string> = {
    gray:'bg-gray-100 text-gray-700',
    blue:'bg-blue-100 text-blue-800',
    green:'bg-green-100 text-green-800',
    red:'bg-red-100 text-red-800',
    amber:'bg-amber-100 text-amber-800',
  };
  return <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', map[color])}>{children}</span>;
};

export const Spinner: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600', className)} />
);
