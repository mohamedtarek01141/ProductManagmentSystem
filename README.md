# Product Management System

A full-stack application for managing products with an ASP.NET Core Web API backend and an Angular frontend.

## 🏗️ Architecture

- **Backend**: ASP.NET Core 8.0 Web API
- **Frontend**: Angular 20
- **Database**: SQL Server (via Entity Framework Core)
- **Authentication**: Static token-based (X-Auth-Token header)

## 📋 Prerequisites

### Backend Requirements
- .NET 8.0 SDK or later
- SQL Server (local or remote instance)
- Visual Studio 2022, Visual Studio Code, or JetBrains Rider

### Frontend Requirements
- Node.js 18.x or later
- npm or yarn package manager

## 🚀 Setup Instructions

### Backend (API) Setup

1. **Navigate to the API project**:
   ```bash
   cd MyApp.API
   ```

2. **Configure Database Connection**:
   
   Update `appsettings.json` with your SQL Server connection string:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Data Source=YOUR_SERVER;Initial Catalog=YOUR_DATABASE;Integrated Security=True;Trust Server Certificate=True"
     }
   }
   ```

3. **Restore NuGet Packages**:
   ```bash
   dotnet restore
   ```

4. **Run Database Migrations**:
   ```bash
   dotnet ef database update
   ```
   
   If you need to create a new migration:
   ```bash
   dotnet ef migrations add MigrationName
   ```

5. **Run the API**:
   ```bash
   dotnet run
   ```
   
   Or use your IDE's run configuration. The API will be available at:
   - HTTPS: `https://localhost:7146`
   - HTTP: `http://localhost:5101`
   - Swagger UI: `https://localhost:7146/swagger`

### Frontend (Angular) Setup

1. **Navigate to the frontend project**:
   ```bash
   cd MyApp.Front
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure API URL** (if needed):
   
   The API URL is configured in `src/app/core/services/product.service.ts`. By default, it points to:
   ```typescript
   private readonly apiUrl = 'https://localhost:7146/api/products';
   ```
   
   If your API runs on a different port or uses HTTP instead of HTTPS, update this URL accordingly.

4. **Run the Development Server**:
   ```bash
   npm start
   ```
   
   The application will be available at `http://127.0.0.1:4200` (or the port specified by Angular CLI).

## 🔑 Authentication

All API requests require an `X-Auth-Token` header with the value: `MyStaticSecureToken123`

This is automatically handled by the Angular HTTP interceptor (`AuthTokenInterceptor`).

To change the token, update:
- **Backend**: `appsettings.json` → `Auth:Token`
- **Frontend**: `src/app/core/interceptors/auth-token.interceptor.ts`

## 📡 API Endpoints

### Base URL
- HTTPS: `https://localhost:7146/api/products`
- HTTP: `http://localhost:5101/api/products`

### Endpoints

#### 1. Get All Products
**GET** `/api/products`

Query Parameters:
- `search` (optional): Search by product name or SKU
- `page` (default: 1): Page number
- `pageSize` (default: 10): Items per page
- `includeDeleted` (default: false): Include soft-deleted products

**Example Request**:
```http
GET https://localhost:7146/api/products?page=1&pageSize=10&includeDeleted=false
X-Auth-Token: MyStaticSecureToken123
```

**Example Response**:
```json
[
  {
    "id": 1,
    "sku": "PROD-001",
    "name": "Product Name",
    "description": "Product description",
    "price": 99.99,
    "createdAtUtc": "2024-01-01T00:00:00Z",
    "updatedAtUtc": "2024-01-02T00:00:00Z",
    "isDeleted": false
  }
]
```

#### 2. Get Product by ID
**GET** `/api/products/{id}`

**Example Request**:
```http
GET https://localhost:7146/api/products/1
X-Auth-Token: MyStaticSecureToken123
```

**Example Response**:
```json
{
  "id": 1,
  "sku": "PROD-001",
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "createdAtUtc": "2024-01-01T00:00:00Z",
  "updatedAtUtc": "2024-01-02T00:00:00Z",
  "isDeleted": false
}
```

#### 3. Create Product
**POST** `/api/products`

**Example Request**:
```http
POST https://localhost:7146/api/products
Content-Type: application/json
X-Auth-Token: MyStaticSecureToken123

{
  "name": "New Product",
  "sku": "PROD-002",
  "description": "Product description",
  "price": 49.99
}
```

**Example Response**:
```json
{
  "success": true,
  "message": "Product created successfully."
}
```

#### 4. Update Product
**PUT** `/api/products/{id}`

**Example Request**:
```http
PUT https://localhost:7146/api/products/1
Content-Type: application/json
X-Auth-Token: MyStaticSecureToken123

{
  "name": "Updated Product Name",
  "sku": "PROD-001",
  "description": "Updated description",
  "price": 79.99
}
```

**Example Response**:
```json
{
  "success": true,
  "message": "Product updated successfully."
}
```

**Note**: SKU cannot be changed during update. The SKU field in the request body is ignored.

#### 5. Delete Product (Soft Delete)
**DELETE** `/api/products/{id}`

**Example Request**:
```http
DELETE https://localhost:7146/api/products/1
X-Auth-Token: MyStaticSecureToken123
```

**Example Response**:
```json
true
```

This performs a **soft delete** - sets `IsDeleted = true` instead of removing the record.

## 🔒 Validation Rules

### Product Creation/Update
- **Name**: Required, maximum 100 characters
- **SKU**: Required, must be unique across all products
- **Price**: Required, must be greater than 0
- **Description**: Optional

### SKU Uniqueness
- SKU must be unique across all products (including deleted ones)
- SKU cannot be changed after product creation
- If a duplicate SKU is provided, the API returns a validation error

## 📝 Important Notes

### Soft Delete

The system implements **soft delete** functionality:

- **Behavior**: When a product is deleted, the `IsDeleted` flag is set to `true` instead of physically removing the record from the database.
- **Visibility**: By default, soft-deleted products are excluded from query results. To include them, use `includeDeleted=true` in the GET request.
- **Benefits**:
  - Data recovery: Deleted products can be restored if needed
  - Audit trail: Maintains historical data
  - Referential integrity: Preserves relationships with other data
- **Usage**: To view deleted products, check the "Show Deleted Products" checkbox in the frontend or include `includeDeleted=true` in API requests.

### Concurrency

**Current Implementation**:
- The API does not implement optimistic concurrency control (no version/timestamp fields).
- **Potential Issues**:
  - If two users update the same product simultaneously, the last write wins.
  - No conflict detection or resolution mechanism.
- **Recommendations**:
  - For production, consider adding:
    - `Version` or `RowVersion` field for optimistic concurrency
    - `ETag` headers for conditional updates
    - Database-level locking for critical operations
  - Implement proper error handling on the client side to handle concurrent update scenarios.

### Idempotency

**GET Requests**: Fully idempotent - multiple identical requests return the same result without side effects.

**POST Requests (Create)**:
- **Not idempotent** - each request creates a new product.
- If you send the same request twice, you'll get two products with different IDs (unless SKU uniqueness validation prevents it).
- **Recommendation**: For idempotent creation, consider implementing:
  - Idempotency keys in request headers
  - SKU-based idempotency (if SKU already exists, return existing product instead of creating new one)

**PUT Requests (Update)**:
- **Idempotent** - multiple identical update requests produce the same final state.
- Sending the same update request multiple times is safe and results in the same product state.

**DELETE Requests**:
- **Idempotent** - deleting an already deleted product returns success (soft delete sets flag, subsequent deletes don't change state).

### API Response Format

All successful responses follow this pattern:
- **GET** endpoints return the requested data directly (Product or array of Products)
- **POST/PUT** endpoints return a `ServiceResponse` object:
  ```json
  {
    "success": boolean,
    "message": string
  }
  ```
- **DELETE** endpoint returns a boolean value (`true` for success)

### Error Handling

The API returns standard HTTP status codes:
- `200 OK`: Successful request
- `400 Bad Request`: Validation errors or invalid request data
- `404 Not Found`: Product not found
- `500 Internal Server Error`: Server-side errors

Error responses include details in the response body:
```json
{
  "errors": {
    "Name": ["The Name field is required."],
    "Price": ["Price must be greater than 0."]
  }
}
```

## 🌐 CORS Configuration

The API is configured to allow all origins, methods, and headers for development purposes. In production, you should restrict CORS to specific origins:

```csharp
// In Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("https://yourdomain.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

## 🧪 Testing

### Using Swagger UI
1. Navigate to `https://localhost:7146/swagger`
2. Use the "Authorize" button to set the auth token: `MyStaticSecureToken123`
3. Test endpoints directly from the Swagger interface

### Using cURL

**Get All Products**:
```bash
curl -X GET "https://localhost:7146/api/products?page=1&pageSize=10" \
  -H "X-Auth-Token: MyStaticSecureToken123" \
  -k
```

**Create Product**:
```bash
curl -X POST "https://localhost:7146/api/products" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: MyStaticSecureToken123" \
  -d '{"name":"Test Product","sku":"TEST-001","price":99.99}' \
  -k
```

**Update Product**:
```bash
curl -X PUT "https://localhost:7146/api/products/1" \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: MyStaticSecureToken123" \
  -d '{"name":"Updated Product","sku":"TEST-001","price":89.99}' \
  -k
```

**Delete Product**:
```bash
curl -X DELETE "https://localhost:7146/api/products/1" \
  -H "X-Auth-Token: MyStaticSecureToken123" \
  -k
```

Note: The `-k` flag is used to bypass SSL certificate validation for localhost development.

## 📁 Project Structure

```
ProductManagmentSystem/
├── MyApp.API/                 # ASP.NET Core Web API
│   ├── Controllers/          # API Controllers
│   ├── Data/                 # Database Context
│   ├── Dtos/                 # Data Transfer Objects
│   ├── Migrations/           # Entity Framework Migrations
│   ├── Models/               # Domain Models
│   ├── Repositories/         # Data Access Layer
│   ├── Services/             # Business Logic Layer
│   └── Program.cs            # Application Entry Point
│
└── MyApp.Front/              # Angular Frontend
    └── src/
        └── app/
            ├── components/   # Angular Components
            ├── core/         # Services, Interceptors
            ├── models/       # TypeScript Models
            └── app-module.ts # Root Module
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure CORS is properly configured in `Program.cs`
   - Verify the frontend URL matches the allowed origins

2. **Authentication Errors**:
   - Verify the `X-Auth-Token` header is included in requests
   - Check that the token value matches `appsettings.json`

3. **Database Connection Errors**:
   - Verify SQL Server is running
   - Check connection string in `appsettings.json`
   - Ensure the database exists and migrations have been applied

4. **SSL Certificate Errors**:
   - For development, you can use HTTP endpoint (`http://localhost:5101`)
   - Or trust the development certificate:
     ```bash
     dotnet dev-certs https --trust
     ```

5. **Port Already in Use**:
   - Change the port in `launchSettings.json` or kill the process using the port

## 📚 Additional Resources

- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [Angular Documentation](https://angular.dev)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)

## 📄 License

This project is provided as-is for educational/demonstration purposes.

## 👤 Support

For issues or questions, please check the troubleshooting section above or consult the project documentation.

