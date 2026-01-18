export default function ImportExportPage() {
  return (
    <section>
      <h2>Import/Export</h2>
      <p>Esporta dati in CSV, PDF ed Excel. Importa file CSV per caricare dati.</p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button type="button">Esporta CSV</button>
        <button type="button">Esporta PDF</button>
        <button type="button">Esporta Excel</button>
      </div>
    </section>
  );
}
