# Gestionale Classic Models

Progetto web (frontend + backend) basato sul database `dbclassicmodels`.

## Stack
- **Backend**: NestJS + TypeORM + MySQL
- **Frontend**: React + Vite
- **Auth**: JWT
- **Report**: viste e procedure MySQL
- **Export**: CSV / PDF / Excel

## Setup rapido

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Variabili ambiente backend
Creare un file `.env` in `backend`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=dbclassicmodels
JWT_SECRET=change-me
```

## Endpoints principali
- `GET /api/customers`
- `GET /api/orders`
- `GET /api/products`
- `GET /api/reports/customers-summary`
- `GET /api/reports/warehouse-status`
- `GET /api/reports/sales-by-employee`
- `GET /api/dashboard/kpis`
