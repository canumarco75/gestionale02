import { useEffect, useState } from 'react';
import { apiClient } from '../api/client';

type Order = {
  orderNumber: number;
  orderDate: string;
  requiredDate: string;
  shippedDate?: string | null;
  status: string;
  customerNumber: number;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.get<Order[]>('/orders');
        setOrders(response.data);
      } catch (err) {
        setError('Impossibile caricare gli ordini. Verifica che il backend sia avviato.');
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();
  }, []);

  return (
    <section>
      <h2>Ordini</h2>
      <p>CRUD ordini e righe ordine con dettagli prodotto.</p>
      <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.5rem' }}>
        {loading && <p>Caricamento ordini...</p>}
        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
        {!loading && !error && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '0.5rem' }}>Ordine</th>
                <th style={{ padding: '0.5rem' }}>Data ordine</th>
                <th style={{ padding: '0.5rem' }}>Cliente</th>
                <th style={{ padding: '0.5rem' }}>Stato</th>
                <th style={{ padding: '0.5rem' }}>Spedito</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderNumber} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.5rem' }}>{order.orderNumber}</td>
                  <td style={{ padding: '0.5rem' }}>{order.orderDate}</td>
                  <td style={{ padding: '0.5rem' }}>{order.customerNumber}</td>
                  <td style={{ padding: '0.5rem' }}>{order.status}</td>
                  <td style={{ padding: '0.5rem' }}>{order.shippedDate ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !error && orders.length === 0 && (
          <p>Nessun ordine disponibile.</p>
        )}
      </div>
    </section>
  );
}
