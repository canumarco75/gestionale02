import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../api/client';

type OrderPayload = {
  orderNumber?: number;
  orderDate?: string;
  requiredDate?: string;
  shippedDate?: string | null;
  status?: string;
  customerNumber?: number;
};

type OrdersFormPageProps = {
  mode: 'create' | 'edit';
};

export default function OrdersFormPage({ mode }: OrdersFormPageProps) {
  const navigate = useNavigate();
  const { orderNumber } = useParams();
  const [formState, setFormState] = useState<OrderPayload>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === 'edit');

  useEffect(() => {
    const loadOrder = async () => {
      if (mode !== 'edit' || !orderNumber) {
        return;
      }
      try {
        const response = await apiClient.get(`/orders/${orderNumber}`);
        const order = response.data;
        setFormState({
          orderNumber: order.orderNumber,
          orderDate: order.orderDate,
          requiredDate: order.requiredDate,
          shippedDate: order.shippedDate,
          status: order.status,
          customerNumber: order.customerNumber
        });
      } catch (err) {
        setError('Impossibile caricare l’ordine selezionato.');
      } finally {
        setLoading(false);
      }
    };

    void loadOrder();
  }, [mode, orderNumber]);

  const handleSubmit = async () => {
    setError(null);
    try {
      if (mode === 'create') {
        await apiClient.post('/orders', formState);
      } else {
        await apiClient.patch(`/orders/${orderNumber}`, formState);
      }
      navigate('/orders');
    } catch (err) {
      setError(mode === 'create' ? 'Errore durante la creazione ordine.' : 'Errore durante l’aggiornamento ordine.');
    }
  };

  return (
    <section>
      <h2>{mode === 'create' ? 'Nuovo ordine' : `Modifica ordine ${orderNumber}`}</h2>
      <p>Inserisci i dati dell’ordine e salva.</p>
      {loading ? (
        <p>Caricamento ordine...</p>
      ) : (
        <div className="card">
          {error && <p className="error-text">{error}</p>}
          <div className="form-grid">
            {mode === 'create' && (
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
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleSubmit}>
              {mode === 'create' ? 'Salva' : 'Aggiorna'}
            </button>
            <button type="button" className="ghost-button" onClick={() => navigate('/orders')}>
              Annulla
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
