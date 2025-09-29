import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Peran } from '../types';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{ role?: Peran }>;

export default function ProtectedRoute({ children, role }: Props) {
  const { pengguna } = useAuth();
  if (!pengguna) return <Navigate to="/login" replace />;
  if (role && pengguna.peran !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}
