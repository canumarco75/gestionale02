import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../api/client';

type CustomerPayload = {
  customerNumber?: number;
  customerName?: string;
  contactFirstName?: string;
  contactLastName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  state?: string | null;
  postalCode?: string | null;
  country?: string;
  salesRepEmployeeNumber?: number | null;
  creditLimit?: string | null;
};

type CustomersFormPageProps = {
  mode: 'create' | 'edit';
};

export default function CustomersFormPage({ mode }: CustomersFormPageProps) {
  const navigate = useNavigate();
  const { customerNumber } = useParams();
  const [formState, setFormState] = useState<CustomerPayload>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === 'edit');

  useEffect(() => {
    const loadCustomer = async () => {
      if (mode !== 'edit' || !customerNumber) {
        return;
      }
      try {
        const response = await apiClient.get(`/customers/${customerNumber}`);
        const customer = response.data;
        setFormState({
          customerNumber: customer.customerNumber,
          customerName: customer.customerName,
          contactFirstName: customer.contactFirstName,
          contactLastName: customer.contactLastName,
          phone: customer.phone,
          addressLine1: customer.addressLine1,
          addressLine2: customer.addressLine2,
          city: customer.city,
          state: customer.state,
          postalCode: customer.postalCode,
          country: customer.country,
          salesRepEmployeeNumber: customer.salesRepEmployeeNumber,
          creditLimit: customer.creditLimit
        });
      } catch (err) {
        setError('Impossibile caricare il cliente selezionato.');
      } finally {
        setLoading(false);
      }
    };

    void loadCustomer();
  }, [mode, customerNumber]);

  const handleSubmit = async () => {
    setError(null);
    try {
      if (mode === 'create') {
        await apiClient.post('/customers', formState);
      } else {
        await apiClient.patch(`/customers/${customerNumber}`, formState);
      }
      navigate('/customers');
    } catch (err) {
      setError(
        mode === 'create' ? 'Errore durante la creazione cliente.' : 'Errore durante l’aggiornamento cliente.'
      );
    }
  };

  return (
    <section>
      <h2>{mode === 'create' ? 'Nuovo cliente' : `Modifica cliente ${customerNumber}`}</h2>
      <p>Inserisci i dati del cliente e salva.</p>
      {loading ? (
        <p>Caricamento cliente...</p>
      ) : (
        <div className="card">
          {error && <p className="error-text">{error}</p>}
          <div className="form-grid">
            {mode === 'create' && (
              <label>
                Numero cliente
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
            )}
            <label>
              Ragione sociale
              <input
                type="text"
                value={formState.customerName ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    customerName: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Nome contatto
              <input
                type="text"
                value={formState.contactFirstName ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    contactFirstName: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Cognome contatto
              <input
                type="text"
                value={formState.contactLastName ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    contactLastName: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Telefono
              <input
                type="text"
                value={formState.phone ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    phone: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Indirizzo
              <input
                type="text"
                value={formState.addressLine1 ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    addressLine1: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Indirizzo 2
              <input
                type="text"
                value={formState.addressLine2 ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    addressLine2: event.target.value || null
                  }))
                }
              />
            </label>
            <label>
              Città
              <input
                type="text"
                value={formState.city ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    city: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Stato
              <input
                type="text"
                value={formState.state ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    state: event.target.value || null
                  }))
                }
              />
            </label>
            <label>
              CAP
              <input
                type="text"
                value={formState.postalCode ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    postalCode: event.target.value || null
                  }))
                }
              />
            </label>
            <label>
              Paese
              <input
                type="text"
                value={formState.country ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    country: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Sales Rep
              <input
                type="number"
                value={formState.salesRepEmployeeNumber ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    salesRepEmployeeNumber: Number(event.target.value) || null
                  }))
                }
              />
            </label>
            <label>
              Limite credito
              <input
                type="text"
                value={formState.creditLimit ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    creditLimit: event.target.value || null
                  }))
                }
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleSubmit}>
              {mode === 'create' ? 'Salva' : 'Aggiorna'}
            </button>
            <button type="button" className="ghost-button" onClick={() => navigate('/customers')}>
              Annulla
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
