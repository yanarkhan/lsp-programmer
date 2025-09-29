import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input, Button, Card } from '../components/UI';
import { useNavigate } from 'react-router-dom';

export default function LoginPage(){
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPwd] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      nav('/'); // navbar akan arahkan sesuai role
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Gagal login');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <h1 className="text-xl font-semibold mb-3">Login</h1>
        {err && <p className="text-red-600 mb-2">{err}</p>}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@dbb.example / pelanggan@dbb.example" />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <Input type="password" value={password} onChange={e => setPwd(e.target.value)} placeholder="admin123 / user123" />
          </div>
          <Button disabled={loading} type="submit">{loading ? 'Memproses...' : 'Masuk'}</Button>
        </form>
      </Card>
    </div>
  );
}
