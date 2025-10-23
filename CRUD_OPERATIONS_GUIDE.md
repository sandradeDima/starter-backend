# CRUD Operations Guide

This guide documents all the CRUD operations available for the application's database tables.

## 📚 Table of Contents

1. [Clientes (Clients)](#clientes-clients)
2. [Coloraciones (Colorations)](#coloraciones-colorations)
3. [Reportes (Reports)](#reportes-reports)
4. [Fotos Reportes (Report Photos)](#fotos-reportes-report-photos)

---

## Clientes (Clients)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clientes` | Get all clients |
| GET | `/api/clientes/search?q=query` | Search clients |
| GET | `/api/clientes/:id` | Get client by ID |
| POST | `/api/clientes` | Create new client |
| PUT | `/api/clientes/:id` | Update client |
| DELETE | `/api/clientes/:id` | Delete client |

### Request Examples

#### Create Client
```json
POST /api/clientes
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "555-1234"
}
```

#### Update Client
```json
PUT /api/clientes/1
{
  "nombre": "Juan Pérez Updated",
  "email": "juan.updated@example.com",
  "telefono": "555-5678"
}
```

#### Search Clients
```
GET /api/clientes/search?q=juan
```

### Response Format
```json
{
  "code": 200,
  "error": false,
  "message": "Cliente obtenido correctamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "555-1234",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Coloraciones (Colorations)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/coloraciones` | Get all colorations |
| GET | `/api/coloraciones/search?q=query` | Search colorations |
| GET | `/api/coloraciones/:id` | Get coloration by ID |
| POST | `/api/coloraciones` | Create new coloration |
| PUT | `/api/coloraciones/:id` | Update coloration |
| DELETE | `/api/coloraciones/:id` | Delete coloration |

### Request Examples

#### Create Coloration
```json
POST /api/coloraciones
{
  "nombre": "Rubio Ceniza",
  "descripcion": "Tono rubio con matices ceniza"
}
```

#### Update Coloration
```json
PUT /api/coloraciones/1
{
  "nombre": "Rubio Ceniza Claro",
  "descripcion": "Tono rubio claro con matices ceniza"
}
```

### Response Format
```json
{
  "code": 200,
  "error": false,
  "message": "Coloración obtenida correctamente",
  "data": {
    "id": 1,
    "nombre": "Rubio Ceniza",
    "descripcion": "Tono rubio con matices ceniza",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Reportes (Reports)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reportes` | Get all reports |
| GET | `/api/reportes/:id` | Get report by ID |
| GET | `/api/reportes/cliente/:clienteId` | Get reports by client |
| GET | `/api/reportes/date-range?startDate=...&endDate=...` | Get reports by date range |
| POST | `/api/reportes` | Create new report |
| PUT | `/api/reportes/:id` | Update report |
| DELETE | `/api/reportes/:id` | Delete report |

### Request Examples

#### Create Report
```json
POST /api/reportes
{
  "clienteId": 1,
  "fechaServicio": "2024-01-15",
  "horaServicio": "14:30:00",
  "coloracionId": 1,
  "formula": "7.1 + 20vol + matizador violeta",
  "observaciones": "Cliente satisfecha con el resultado",
  "precio": 1500.50
}
```

#### Update Report
```json
PUT /api/reportes/1
{
  "clienteId": 1,
  "fechaServicio": "2024-01-15",
  "horaServicio": "14:30:00",
  "coloracionId": 2,
  "formula": "7.1 + 20vol + matizador violeta + 10g de refuerzo",
  "observaciones": "Se ajustó la fórmula",
  "precio": 1600.00
}
```

#### Get Reports by Date Range
```
GET /api/reportes/date-range?startDate=2024-01-01&endDate=2024-01-31
```

#### Get Reports by Client
```
GET /api/reportes/cliente/1
```

### Response Format
```json
{
  "code": 200,
  "error": false,
  "message": "Reporte obtenido correctamente",
  "data": {
    "id": 1,
    "clienteId": 1,
    "fechaServicio": "2024-01-15T00:00:00.000Z",
    "horaServicio": "14:30:00",
    "coloracionId": 1,
    "formula": "7.1 + 20vol + matizador violeta",
    "observaciones": "Cliente satisfecha con el resultado",
    "precio": 1500.50,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "clienteNombre": "Juan Pérez",
    "clienteEmail": "juan@example.com",
    "coloracionNombre": "Rubio Ceniza"
  }
}
```

---

## Fotos Reportes (Report Photos)

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/fotos-reportes` | Get all photos |
| GET | `/api/fotos-reportes/:id` | Get photo by ID |
| GET | `/api/fotos-reportes/reporte/:reporteId` | Get photos by report |
| POST | `/api/fotos-reportes` | Create new photo |
| PUT | `/api/fotos-reportes/:id` | Update photo |
| DELETE | `/api/fotos-reportes/:id` | Delete photo |
| DELETE | `/api/fotos-reportes/reporte/:reporteId` | Delete all photos from a report |

### Request Examples

#### Create Photo
```json
POST /api/fotos-reportes
{
  "reporteId": 1,
  "filename": "reporte_1_foto_antes.jpg"
}
```

#### Update Photo
```json
PUT /api/fotos-reportes/1
{
  "reporteId": 1,
  "filename": "reporte_1_foto_antes_updated.jpg"
}
```

#### Get Photos by Report
```
GET /api/fotos-reportes/reporte/1
```

#### Delete All Photos from Report
```
DELETE /api/fotos-reportes/reporte/1
```

### Response Format
```json
{
  "code": 200,
  "error": false,
  "message": "Foto obtenida correctamente",
  "data": {
    "id": 1,
    "reporteId": 1,
    "filename": "reporte_1_foto_antes.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🔐 Authentication

Most endpoints require authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

## 📝 Validation

All create and update endpoints use Zod validation schemas. Invalid data will return a 400 error with details about which fields failed validation.

### Example Validation Error
```json
{
  "code": 400,
  "error": true,
  "message": "Validation error",
  "data": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

## 🗂️ File Structure

```
src/
├── repositories/
│   ├── clientes.repo.ts
│   ├── coloraciones.repo.ts
│   ├── reportes.repo.ts
│   └── fotosReportes.repo.ts
├── services/
│   ├── clientes.service.ts
│   ├── coloraciones.service.ts
│   ├── reportes.service.ts
│   └── fotosReportes.service.ts
├── controllers/
│   ├── clientes.controller.ts
│   ├── coloraciones.controller.ts
│   ├── reportes.controller.ts
│   └── fotosReportes.controller.ts
├── routes/
│   ├── clientes.routes.ts
│   ├── coloraciones.routes.ts
│   ├── reportes.routes.ts
│   └── fotosReportes.routes.ts
└── schemas/
    ├── clientes.schema.ts
    ├── coloraciones.schema.ts
    ├── reportes.schema.ts
    └── fotosReportes.schema.ts
```

## 🎯 Features Implemented

- ✅ Full CRUD operations for all tables
- ✅ Input validation with Zod
- ✅ Consistent error handling
- ✅ Search functionality for clientes and coloraciones
- ✅ Advanced filtering (date range for reportes)
- ✅ Relationship handling (JOIN queries for detailed data)
- ✅ Cascade operations (delete all photos by report)
- ✅ RESTful API design
- ✅ TypeScript type safety throughout

## 🚀 Next Steps

1. Add authentication middleware to protected routes
2. Implement file upload for photo management
3. Add pagination for large datasets
4. Create database indexes for better performance
5. Add unit and integration tests

