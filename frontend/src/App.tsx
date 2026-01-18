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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div data-theme={theme}>
      <div className="app-shell">
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <h2>Funzionalità</h2>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              {sidebarCollapsed ? '›' : '‹'}
            </button>
          </div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`.trim()
                }
              >
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="main-column">
          <header className="topbar">
            <div>
              <h1>Gestionale Classic Models</h1>
              <p className="subtitle">Frontend React collegato alle API NestJS</p>
            </div>
            <div className="topbar-actions">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? 'Dark mode' : 'Light mode'}
              </button>
              <div className="avatar" title="Profilo utente">
                U
              </div>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>
            </div>
          </header>
          <main className="main-content">
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
