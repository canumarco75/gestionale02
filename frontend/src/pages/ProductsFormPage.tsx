import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../api/client';

type ProductPayload = {
  productCode?: string;
  productName?: string;
  productLineCode?: string;
  productScale?: string;
  productVendor?: string;
  productDescription?: string;
  quantityInStock?: number;
  buyPrice?: string;
  msrp?: string;
};

type ProductsFormPageProps = {
  mode: 'create' | 'edit';
};

export default function ProductsFormPage({ mode }: ProductsFormPageProps) {
  const navigate = useNavigate();
  const { productCode } = useParams();
  const [formState, setFormState] = useState<ProductPayload>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(mode === 'edit');

  useEffect(() => {
    const loadProduct = async () => {
      if (mode !== 'edit' || !productCode) {
        return;
      }
      try {
        const response = await apiClient.get(`/products/${productCode}`);
        const product = response.data;
        setFormState({
          productCode: product.productCode,
          productName: product.productName,
          productLineCode: product.productLineCode,
          productScale: product.productScale,
          productVendor: product.productVendor,
          productDescription: product.productDescription,
          quantityInStock: product.quantityInStock,
          buyPrice: product.buyPrice,
          msrp: product.msrp
        });
      } catch (err) {
        setError('Impossibile caricare il prodotto selezionato.');
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
  }, [mode, productCode]);

  const handleSubmit = async () => {
    setError(null);
    try {
      if (mode === 'create') {
        await apiClient.post('/products', formState);
      } else {
        await apiClient.patch(`/products/${productCode}`, formState);
      }
      navigate('/products');
    } catch (err) {
      setError(
        mode === 'create' ? 'Errore durante la creazione prodotto.' : 'Errore durante l’aggiornamento prodotto.'
      );
    }
  };

  return (
    <section>
      <h2>{mode === 'create' ? 'Nuovo prodotto' : `Modifica prodotto ${productCode}`}</h2>
      <p>Inserisci i dati del prodotto e salva.</p>
      {loading ? (
        <p>Caricamento prodotto...</p>
      ) : (
        <div className="card">
          {error && <p className="error-text">{error}</p>}
          <div className="form-grid">
            {mode === 'create' && (
              <label>
                Codice prodotto
                <input
                  type="text"
                  value={formState.productCode ?? ''}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      productCode: event.target.value
                    }))
                  }
                />
              </label>
            )}
            <label>
              Nome prodotto
              <input
                type="text"
                value={formState.productName ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    productName: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Linea prodotto
              <input
                type="text"
                value={formState.productLineCode ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    productLineCode: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Scala
              <input
                type="text"
                value={formState.productScale ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    productScale: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Vendor
              <input
                type="text"
                value={formState.productVendor ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    productVendor: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Descrizione
              <input
                type="text"
                value={formState.productDescription ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    productDescription: event.target.value
                  }))
                }
              />
            </label>
            <label>
              Quantità in stock
              <input
                type="number"
                value={formState.quantityInStock ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    quantityInStock: Number(event.target.value)
                  }))
                }
              />
            </label>
            <label>
              Prezzo acquisto
              <input
                type="text"
                value={formState.buyPrice ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    buyPrice: event.target.value
                  }))
                }
              />
            </label>
            <label>
              MSRP
              <input
                type="text"
                value={formState.msrp ?? ''}
                onChange={(event) =>
                  setFormState((prev) => ({
                    ...prev,
                    msrp: event.target.value
                  }))
                }
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleSubmit}>
              {mode === 'create' ? 'Salva' : 'Aggiorna'}
            </button>
            <button type="button" className="ghost-button" onClick={() => navigate('/products')}>
              Annulla
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
