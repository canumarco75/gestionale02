import { useEffect, useMemo, useState } from 'react';
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
  const [formState, setFormState] = useState<Partial<Order>>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const handleCreate = async () => {
    setError(null);
    try {
      await apiClient.post('/orders', formState);
      setFormState({});
      await fetchOrders();
    } catch (err) {
      setError('Errore durante la creazione ordine.');
    }
  };

  const handleUpdate = async () => {
    if (!selectedOrder?.orderNumber) {
      setError('Seleziona un ordine da modificare.');
      return;
    }
    setError(null);
    try {
      await apiClient.patch(`/orders/${selectedOrder.orderNumber}`, formState);
      setSelectedOrder(null);
      setFormState({});
      await fetchOrders();
    } catch (err) {
      setError('Errore durante l’aggiornamento ordine.');
    }
  };

  const handleDelete = async (orderNumber: number) => {
    if (!window.confirm(`Eliminare l'ordine ${orderNumber}?`)) {
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

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setFormState({
      orderDate: order.orderDate,
      requiredDate: order.requiredDate,
      shippedDate: order.shippedDate,
      status: order.status,
      customerNumber: order.customerNumber
    });
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
      <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.5rem' }}>
        {loading && <p>Caricamento ordini...</p>}
        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
        {!loading && !error && (
          <>
            <p>
              Totale ordini: <strong>{total}</strong>
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  {columnList.map((column) => (
                    <th
                      key={column.key}
                      style={{ padding: '0.5rem', cursor: 'pointer' }}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                      {sortBy === column.key ? (sortDir === 'ASC' ? ' ▲' : ' ▼') : ''}
                    </th>
                  ))}
                  <th style={{ padding: '0.5rem' }}>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderNumber} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    {columnList.map((column) => (
                      <td key={column.key} style={{ padding: '0.5rem' }}>
                        {order[column.key] ?? '—'}
                      </td>
                    ))}
                    <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button type="button" onClick={() => handleSelectOrder(order)}>
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
      <section style={{ marginTop: '1.5rem' }}>
        <h3>{selectedOrder ? `Modifica ordine ${selectedOrder.orderNumber}` : 'Nuovo ordine'}</h3>
        <div style={{ display: 'grid', gap: '0.75rem', maxWidth: '420px' }}>
          {!selectedOrder && (
            <label>
              Numero ordine
              <input
                type="number"
                value={formState.orderNumber ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    orderNumber: Number(event.target.value)
                  }))
                }
              />
            </label>
          )}
          <label>
            Data ordine
            <input
              type="date"
              value={formState.orderDate ?? ''}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  orderDate: event.target.value
                }))
              }
            />
          </label>
          <label>
            Data richiesta
            <input
              type="date"
              value={formState.requiredDate ?? ''}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  requiredDate: event.target.value
                }))
              }
            />
          </label>
          <label>
            Data spedizione
            <input
              type="date"
              value={formState.shippedDate ?? ''}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  shippedDate: event.target.value || null
                }))
              }
            />
          </label>
          <label>
            Stato
            <input
              type="text"
              value={formState.status ?? ''}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  status: event.target.value
                }))
              }
            />
          </label>
          <label>
            Cliente
            <input
              type="number"
              value={formState.customerNumber ?? ''}
              onChange={(event) =>
                setFormState((prev) => ({
                  ...prev,
                  customerNumber: Number(event.target.value)
                }))
              }
            />
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={selectedOrder ? handleUpdate : handleCreate}>
              {selectedOrder ? 'Aggiorna' : 'Crea'}
            </button>
            {selectedOrder && (
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setFormState({});
                }}
              >
                Annulla
              </button>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
