export default function LoginPage() {
  return (
    <section>
      <h2>Login</h2>
      <form style={{ maxWidth: '320px', display: 'grid', gap: '0.75rem' }}>
        <label>
          Email
          <input type="email" placeholder="admin@example.com" style={{ width: '100%' }} />
        </label>
        <label>
          Password
          <input type="password" placeholder="••••••" style={{ width: '100%' }} />
        </label>
        <button type="submit">Accedi</button>
      </form>
    </section>
  );
}
