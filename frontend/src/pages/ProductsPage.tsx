import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

type Product = {
  productCode: string;
  productName: string;
  productLineCode: string;
  productScale: string;
  productVendor: string;
  quantityInStock: number;
  buyPrice: string;
  msrp: string;
};

type ProductsResponse = {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
};

const columns = [
  { key: 'productCode', label: 'Codice' },
  { key: 'productName', label: 'Prodotto' },
  { key: 'productLineCode', label: 'Linea' },
  { key: 'productScale', label: 'Scala' },
  { key: 'productVendor', label: 'Vendor' },
  { key: 'quantityInStock', label: 'Stock' },
  { key: 'buyPrice', label: 'Costo' },
  { key: 'msrp', label: 'MSRP' }
] as const;

type ColumnKey = (typeof columns)[number]['key'];

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<ColumnKey>('productName');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC');
  const [search, setSearch] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKey, boolean>>({
    productCode: true,
    productName: true,
    productLineCode: true,
    productScale: false,
    productVendor: true,
    quantityInStock: true,
    buyPrice: true,
    msrp: false
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const columnList = useMemo(
    () => columns.filter((column) => visibleColumns[column.key]),
    [visibleColumns]
  );

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<ProductsResponse>('/products', {
        params: {
          page,
          pageSize,
          sortBy,
          sortDir,
          search: search || undefined
        }
      });
      setProducts(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      setError('Impossibile caricare i prodotti. Verifica che il backend sia avviato.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, [page, pageSize, sortBy, sortDir, search]);

  const handleSort = (column: ColumnKey) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'ASC' ? 'DESC' : 'ASC');
      return;
    }
    setSortBy(column);
    setSortDir('ASC');
  };

  const handleDelete = async (productCode: string) => {
    if (!window.confirm(`Confermi l'eliminazione del prodotto ${productCode}?`)) {
      return;
    }
    setError(null);
    try {
      await apiClient.delete(`/products/${productCode}`);
      await fetchProducts();
    } catch (err) {
      setError('Errore durante l’eliminazione prodotto.');
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    window.open(`http://localhost:3001/api/export/${format}/products`, '_blank');
  };

  return (
    <section>
      <h2>Prodotti</h2>
      <p>Gestione catalogo prodotti e linee.</p>
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
          <button type="button" onClick={() => navigate('/products/new')}>
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
        {loading && <p>Caricamento prodotti...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && (
          <>
            <p className="total-count">
              Totale prodotti: <strong>{total}</strong>
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
                {products.map((product) => (
                  <tr key={product.productCode}>
                    {columnList.map((column) => (
                      <td key={column.key}>{product[column.key] ?? '—'}</td>
                    ))}
                    <td className="table-actions">
                      <button
                        type="button"
                        onClick={() => navigate(`/products/${product.productCode}`)}
                      >
                        Modifica
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.productCode)}
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <p>Nessun prodotto disponibile.</p>}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                Prev
              </button>
              <span className="pagination-info">
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
