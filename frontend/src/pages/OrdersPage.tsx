import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

type Order = {
  orderNumber: number;
  orderDate: string;
  requiredDate: string;
  shippedDate?: string | null;
  status: string;
  customerNumber: number;
};

type OrdersResponse = {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
};

const columns = [
  { key: 'orderNumber', label: 'Ordine' },
  { key: 'orderDate', label: 'Data ordine' },
  { key: 'requiredDate', label: 'Data richiesta' },
  { key: 'customerNumber', label: 'Cliente' },
  { key: 'status', label: 'Stato' },
  { key: 'shippedDate', label: 'Spedito' }
] as const;

type ColumnKey = (typeof columns)[number]['key'];

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<ColumnKey>('orderDate');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');
  const [search, setSearch] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    orderNumber: true,
    orderDate: true,
    requiredDate: false,
    customerNumber: true,
    status: true,
    shippedDate: true
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const columnList = useMemo(
    () => columns.filter((column) => visibleColumns[column.key]),
    [visibleColumns]
  );

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<OrdersResponse>('/orders', {
        params: {
          page,
          pageSize,
          sortBy,
          sortDir,
          search: search || undefined
        }
      });
      setOrders(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      setError('Impossibile caricare gli ordini. Verifica che il backend sia avviato.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, [page, pageSize, sortBy, sortDir, search]);

  const handleSort = (column: ColumnKey) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
      return;
    }
    setSortBy(column);
    setSortDir('ASC');
  };

  const handleDelete = async (orderNumber: number) => {
    if (!window.confirm(`Confermi l'eliminazione dell'ordine ${orderNumber}?`)) {
      return;
    }
    setError(null);
    try {
      await apiClient.delete(`/orders/${orderNumber}`);
      await fetchOrders();
    } catch (err) {
      setError('Errore durante l’eliminazione ordine.');
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    window.open(`http://localhost:3001/api/export/${format}/orders`, '_blank');
  };

  return (
    <section>
      <h2>Ordini</h2>
      <p>CRUD ordini e righe ordine con dettagli prodotto.</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Ricerca globale..."
          value={search}
          onChange={(event) => {
            setPage(1);
            setSearch(event.target.value);
          }}
          style={{ padding: '0.5rem', minWidth: '200px' }}
        />
        <label>
          Page size
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => navigate('/orders/new')}>
            Aggiungi
          </button>
          <button type="button" onClick={() => handleExport('csv')}>
            Esporta CSV
          </button>
          <button type="button" onClick={() => handleExport('excel')}>
            Esporta Excel
          </button>
          <button type="button" onClick={() => handleExport('pdf')}>
            Esporta PDF
          </button>
        </div>
      </div>
      <details style={{ marginBottom: '1rem' }}>
        <summary>Colonne visibili</summary>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {columns.map((column) => (
            <label key={column.key} style={{ display: 'flex', gap: '0.25rem' }}>
              <input
                type="checkbox"
                checked={visibleColumns[column.key]}
                onChange={(event) =>
                  setVisibleColumns((prev) => ({
                    ...prev,
                    [column.key]: event.target.checked
                  }))
                }
              />
              {column.label}
            </label>
          ))}
        </div>
      </details>
      <div className="card">
        {loading && <p>Caricamento ordini...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && (
          <>
            <p>
              Totale ordini: <strong>{total}</strong>
            </p>
            <table className="data-table">
              <thead>
                <tr>
                  {columnList.map((column) => (
                    <th
                      key={column.key}
                      className="sortable"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                      {sortBy === column.key ? (sortDir === 'ASC' ? ' ▲' : ' ▼') : ''}
                    </th>
                  ))}
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderNumber}>
                    {columnList.map((column) => (
                      <td key={column.key}>
                        {order[column.key] ?? '—'}
                      </td>
                    ))}
                    <td className="table-actions">
                      <button type="button" onClick={() => navigate(`/orders/${order.orderNumber}`)}>
                        Modifica
                      </button>
                      <button type="button" onClick={() => handleDelete(order.orderNumber)}>
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p>Nessun ordine disponibile.</p>}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                Prev
              </button>
              <span>
                Pagina {page} di {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
