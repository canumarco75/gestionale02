import { NavLink, Route, Routes } from 'react-router-dom';
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
  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', padding: '1.5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Gestionale Classic Models</h1>
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            Frontend React collegato alle API NestJS
          </p>
        </div>
        <NavLink to="/login" style={{ alignSelf: 'center' }}>
          Login
        </NavLink>
      </header>
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#1d4ed8' : '#111'
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <main>
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
  );
}
