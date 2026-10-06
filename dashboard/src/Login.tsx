import { FormEvent, useState } from 'react';
import { api, setToken, type User } from './api';

export function Login({ onSuccess }: { onSuccess: (user: User) => void }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      const result = await api<{ data: { token: string; user: User } }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(result.data.token);
      onSuccess(result.data.user);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'تعذر تسجيل الدخول');
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="login">
      <form className="card" onSubmit={submit}>
        <h1>لوحة قريعة</h1>
        <p className="muted">إدارة منتجات الموقع</p>
        <label>
          البريد
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label>
          كلمة المرور
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="primary" type="submit" disabled={pending}>
          {pending ? 'جارٍ الدخول...' : 'دخول'}
        </button>
      </form>
    </main>
  );
}
