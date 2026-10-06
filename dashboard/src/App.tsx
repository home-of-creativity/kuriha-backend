import { useEffect, useState } from 'react';
import { api, setToken, token, type User } from './api';
import { Login } from './Login';
import { Products } from './Products';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!token());

  useEffect(() => {
    if (!token()) return;
    api<{ data: User }>('/api/auth/me')
      .then((result) => setUser(result.data))
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, []);

  async function logout() {
    await api('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    setToken(null);
    setUser(null);
  }

  if (!ready) return null;
  if (!user) return <Login onSuccess={setUser} />;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <strong>KOREIHA</strong>
          <span>المنتجات</span>
        </div>
        <button className="ghost" type="button" onClick={logout}>خروج</button>
      </header>
      <main className="shell">
        <div className="toolbar">
          <h1>المنتجات</h1>
          <p className="muted">{user.name}</p>
        </div>
        <Products />
      </main>
    </div>
  );
}
