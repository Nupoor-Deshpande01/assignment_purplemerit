# PurpleMerit - MERN Role-Based User Management System

An enterprise-grade, robust full-stack web application designed for absolute scale and strict auditing, specifically built as an internship assessment completion node.

## 🚀 Features & Architecture
- **Strict Role-Based Access Control (RBAC)**: Supports explicit hierarchical layers (Admin, Manager, Standard User). Each accesses strictly scoped data sets securely.
- **Deep Audit Logging**: Native tracking configurations noting the originating `createdBy` and mutating `updatedBy` system agents directly appended to document trails natively via payload middleware handling.
- **Seamless Auth Loop**: Implements industry-standard asymmetric stateless tokens (`accessToken`/`refreshToken` dual mechanisms) relying securely on isolated `httpOnly` secure memory footprints completely shielded from XSS logic gaps.
- **Responsive Dynamic UI**: Driven through pure context-aware React component hierarchies utilizing Debounced network hooks and comprehensive ErrorBoundary/NotFound fallback safety nets.
- **Paginating Power**: Native integration with `mongoose-paginate-v2` guarantees ultra-low memory load even when sorting through 10,000+ users.

## 💻 Tech Stack
- **Backend API Layer**: Node.js, Express, strict native `express-validator` guarding, JWT (short/long lived sets).
- **Database Architecture**: MongoDB hosted remotely via Atlas, heavily optimized Mongoose schemas mapped with `bcryptjs`.
- **Frontend SPA Layer**: Vite Bootstrapped React 18 cleanly implemented with `react-router-dom`, context APIs, and unified networking with robust `axios.js` interceptors preventing unauthorized state logic loops securely.

## 📂 Folder Structure

```text
/
├── backend/ (Root Files)
│   ├── models/           # Mongoose schemas perfectly formatted
│   ├── controllers/      # Handlers resolving robust RBAC constraints
│   ├── routes/           # Strict validations mapping to express-validator
│   ├── middleware/       # Custom Auth/Role guards protecting state integrity
│   ├── services/         # Decoupled backend business logic 
│   ├── seed/             # Safe database population scripts securing admin rights
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/          # Network layer resolving cross-origin configurations
    │   ├── components/   # Globally reusable abstractions (Navigation, ErrorBoundary)
    │   ├── context/      # Complex state holding engines (Auth, Toasts)
    │   ├── hooks/        # Intelligent debounces preventing memory leaks
    │   ├── pages/        # Conditional structural application views 
    │   └── routes/       # Explicit Protected/Role bounded functional gates
    └── package.json
```

## ⚙️ Local Setup Instructions

### Environment Setup (Backend)
1. Initialize dependencies securely from project root:
   ```bash
   npm install
   ```
2. Replicate `.env.example` manually into a root folder `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` securely injecting your custom configurations explicitly:

| Key | Value Example | Description |
|---|---|---|
| `PORT` | `5000` | Port Node API bindings open to. |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB local or Atlas cluster connection string. |
| `JWT_ACCESS_SECRET` | `somesecret` | Cryptographic signature string for short lived tokens. |
| `JWT_REFRESH_SECRET` | `somesecret2` | Cryptographic signature string for HTTP-Only refresh bounds. |
| `JWT_ACCESS_EXPIRES` | `15m` | Explicit termination threshold for in-memory token values. |
| `JWT_REFRESH_EXPIRES` | `7d` | Explicit validation rotation threshold logic. |
| `CLIENT_URL` | `http://localhost:5173` | Allowed specific origins connecting safely through CORS module. |

### Environment Setup (Frontend)
1. Open the inner `frontend/` directory precisely:
   ```bash
   cd frontend
   npm install
   ```
2. Create `.env` purely mapping external routing mechanisms dynamically:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

### Run Application Servers concurrently
**Backend:**
```bash
npm run dev
```
**Frontend:**
```bash
cd frontend && npm run dev
```

## 📡 Initial Database Seeding
To instantiate system components efficiently open a clean CLI trace natively pointed at the root hierarchy and run:
```bash
node seed/seedAdmin.js
```
The algorithm validates if `admin@purplemerit.com` exists already, and cleanly bypasses duplicate injections ensuring total idempotency. You can log into mapping utilizing `Admin@123`.

## 🌐 API Endpoints Reference Matrix

| Request Route | Protected Group Rules | Endpoint Operation Spec |
|---|---|---|
| `POST /api/auth/register` | None / Public | Native payload allocation yielding secure token response.
| `POST /api/auth/login` | None / Public | Validation gateway ensuring Active status and strict hash validations.
| `POST /api/auth/refresh` | None / Public | Deep memory inspection of isolated Cookies providing automatic extension cycles.
| `POST /api/auth/logout` | None / Public | Safe destruction mechanism targeting cross-origin configurations completely.
| `GET /api/auth/me` | Logged In Entity | Populated mapping explicitly decoupling identity from password leaks reliably. 
| `GET /api/users` | Admins, Managers | Network aggregated search matrix filtering strings against `active` roles safely.
| `GET /api/users/:id` | Admins, Managers | Specific explicit queries loading Audit (`createdBy`) nodes effectively natively.
| `POST /api/users` | Admins Only | Direct manual user provisions mapping explicit roles cleanly.
| `PUT /api/users/:id` | Admin, Managers* | Updating logic heavily guarded mapping internal restrictions reliably targeting identity constraints dynamically.
| `DELETE /api/users/:id` | Admins Only | Idempotent structural mapping explicitly assigning `isActive` to false softly.

*(1) Note: Managers cannot escalate standard Users to Admin schemas, or edit current system-level Administrations.*

## ☁️ Deployment Instructions

### Back-End To Render (Free Tier)
We have fully baked in an Infrastructure as Code (IaC) configuration relying cleanly upon `render.yaml`.
1. Upload your codebase to a secure GitHub module configuration repository.
2. Sign in to your external Render panel natively linking the specific Github repo globally.
3. Automatically configure using the Blueprint config mechanism natively pointing explicitly to your repo structure! It will securely parse the generated script.
4. Go cleanly to your dashboard configurations mapping `MONGO_URI` directly under explicit environmental bounds securing secrets cleanly. 
5. Deploy explicitly. 

### Front-End To Vercel
1. Log into your clean Vercel network bindings targeting your explicit GitHub instance safely mapping configurations correctly.
2. Ensure you specify your `Framework Preset` perfectly locking natively to `Vite`.
3. Configure the `Build Command` dynamically mapped securely into `npm run build`.
4. Ensure the `Output Directory` maps strictly into the standard Vite `dist` generation bounds internally.
5. In your Environment Configurations natively attach `VITE_API_URL` cleanly pointing to your newly created external Render endpoint domain structurally resolving completely.
6. Trigger the explicit core `Deploy` functionality.

## 🖼️ Application Showcases
*(Placeholders allocated completely for final deployed visual screenshots!)*
- `[Screenshot 1 - System Overlook Dashboard Mapping Rules Natively]`
- `[Screenshot 2 - Mongoose Paginating Configurations Explicit Datatable Loading]`
- `[Screenshot 3 - Complex Protected View Validation Screen Rules]`

## 🌍 Deployed Links Mapping Schema
- **RESTful Secure API:** `https://your-app.onrender.com/api` (Placeholder)
- **Vite React Core UI:** `https://your-ui.vercel.app` (Placeholder)
