import { NavLink, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomersFormPage from './pages/CustomersFormPage';
import OrdersPage from './pages/OrdersPage';
import OrdersFormPage from './pages/OrdersFormPage';
import ProductsPage from './pages/ProductsPage';
import ReportsPage from './pages/ReportsPage';
import ImportExportPage from './pages/ImportExportPage';
import LoginPage from './pages/LoginPage';

const navItems = [
  { label: 'Dashboard', to: '/', icon: 'dashboard' },
  { label: 'Clienti', to: '/customers', icon: 'group' },
  { label: 'Ordini', to: '/orders', icon: 'receipt_long' },
  { label: 'Prodotti', to: '/products', icon: 'inventory_2' },
  { label: 'Report', to: '/reports', icon: 'bar_chart' },
  { label: 'Import/Export', to: '/import-export', icon: 'swap_horiz' }
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
              className="ghost-button collapse-button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              aria-label={sidebarCollapsed ? 'Espandi sidebar' : 'Comprimi sidebar'}
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
                title={item.label}
              >
                <span className="nav-icon material-symbols-outlined" aria-hidden="true">
                  {item.icon}
                </span>
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
              <Route path="/customers/new" element={<CustomersFormPage mode="create" />} />
              <Route path="/customers/:customerNumber" element={<CustomersFormPage mode="edit" />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/new" element={<OrdersFormPage mode="create" />} />
              <Route path="/orders/:orderNumber" element={<OrdersFormPage mode="edit" />} />
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
