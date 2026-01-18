import { NavLink, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import ReportsPage from './pages/ReportsPage';
import ImportExportPage from './pages/ImportExportPage';
import LoginPage from './pages/LoginPage';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Clienti', to: '/customers' },
  { label: 'Ordini', to: '/orders' },
  { label: 'Prodotti', to: '/products' },
  { label: 'Report', to: '/reports' },
  { label: 'Import/Export', to: '/import-export' }
];

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div data-theme={theme}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside
          style={{
            width: '240px',
            background: 'var(--surface)',
            borderRight: '1px solid var(--border)',
            padding: '1.5rem'
          }}
        >
          <h2 style={{ marginTop: 0 }}>Funzionalità</h2>
          <nav style={{ display: 'grid', gap: '0.75rem' }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary)' : 'var(--text)'
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 2rem',
              borderBottom: '1px solid var(--border)',
              background: 'var(--surface)'
            }}
          >
            <div>
              <h1 style={{ margin: 0 }}>Gestionale Classic Models</h1>
              <p style={{ margin: '0.25rem 0', color: 'var(--muted)' }}>
                Frontend React collegato alle API NestJS
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  cursor: 'pointer'
                }}
              >
                {theme === 'light' ? 'Dark mode' : 'Light mode'}
              </button>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 600
                }}
                title="Profilo utente"
              >
                U
              </div>
              <NavLink to="/login" style={{ textDecoration: 'none', color: 'var(--text)' }}>
                Login
              </NavLink>
            </div>
          </header>
          <main style={{ padding: '2rem' }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/import-export" element={<ImportExportPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}
