# Nestwell Backend (Node.js + Express + MongoDB)

A simple, plain Express + Mongoose API for the Nestwell PG Admin Panel.
Written entirely with ES module `import` syntax (no `require`).

## 1. What's inside

```
pg-admin-panel-backend/
├── server.js              # app entry point
├── config/db.js           # MongoDB connection
├── models/                # Mongoose schemas
│   ├── User.js             # super admin / admin / tenant accounts (login)
│   ├── Room.js
│   ├── Tenant.js            # tenant directory managed by admins
│   ├── Rent.js
│   └── Complaint.js
├── middleware/auth.js      # JWT "protect" + role-based "authorize"
├── routes/
│   ├── auth.routes.js       # register, login, me, avatar
│   ├── room.routes.js
│   ├── tenant.routes.js
│   ├── rent.routes.js
│   ├── complaint.routes.js
│   └── admin.routes.js      # super admin managing admin accounts
├── .env.example
└── package.json
```

Every collection is stored in MongoDB — nothing is hardcoded or in-memory,
so data you create is real and persists between restarts.

## 2. Install MongoDB (pick one)

**Option A — Local MongoDB (simplest for testing)**
Install MongoDB Community Server for your OS, then start it. It listens on
`mongodb://127.0.0.1:27017` by default.

**Option B — MongoDB Atlas (free cloud database, no install)**
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user + password
3. Click "Connect" → "Drivers" and copy the connection string, e.g.
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/nestwell`

## 3. Set up the backend

```bash
cd pg-admin-panel-backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
```
MONGO_URI=mongodb://127.0.0.1:27017/nestwell        # or your Atlas string
JWT_SECRET=any_long_random_string
PORT=5000
CLIENT_URL=http://localhost:5173                     # your frontend's URL
```

Run it:
```bash
npm run dev     # auto-restarts on file changes (nodemon)
# or
npm start       # plain node
```

You should see:
```
MongoDB connected: <your host>
Nestwell API running on http://localhost:5000
```

Test it's alive: open `http://localhost:5000/api/health` — it should return `{"status":"ok"}`.

## 4. How the data model matches the app

| Frontend concept                     | Backend collection | Notes |
|---------------------------------------|---------------------|-------|
| Role select → Register → Sign in      | `User`              | one document per (email, role) pair |
| Rooms page                            | `Room`              | |
| Tenants page                          | `Tenant`            | admin-managed directory |
| Rent page / tenant's own rent status  | `Rent`              | references a `Tenant` |
| Complaints / My Complaints            | `Complaint`         | references a `Tenant` |
| Manage Admins page                    | `User` (role: admin)| super admin only |
| Profile photo upload                  | `User.avatar`       | stored as a base64 data URL string |

## 5. API reference (all responses are JSON)

Send the token from login/register as a header on every protected request:
```
Authorization: Bearer <token>
```

### Auth — `/api/auth`
| Method | Route            | Access        | Body |
|--------|-------------------|---------------|------|
| POST   | `/register`       | public        | `{ name, email, phone, password, role }` |
| POST   | `/login`          | public        | `{ email, password, role }` |
| GET    | `/me`              | logged in     | — |
| PATCH  | `/avatar`          | logged in     | `{ avatar: "data:image/png;base64,..." }` |

`role` must be one of `"superadmin"`, `"admin"`, `"tenant"` — same values the
frontend already uses (`ROLES` in `AuthContext.jsx`).

Register/Login both respond with:
```json
{ "token": "...", "user": { "id", "name", "email", "phone", "role", "pg", "room", "avatar" } }
```

### Rooms — `/api/rooms` (super admin & admin only)
`GET /`, `POST /`, `PUT /:id`, `DELETE /:id`

### Tenants — `/api/tenants` (super admin & admin only)
`GET /`, `POST /`, `PUT /:id`, `DELETE /:id`

### Rent — `/api/rent`
- `GET /` — super admin/admin, all records
- `GET /me` — tenant, their own rent history
- `POST /`, `PUT /:id`, `DELETE /:id` — super admin/admin

### Complaints — `/api/complaints`
- `GET /` — super admin/admin, all complaints
- `GET /me` — tenant, their own complaints
- `POST /me` — tenant, raise a new complaint
- `PUT /:id`, `DELETE /:id` — super admin/admin

### Admins — `/api/admins` (super admin only)
`GET /`, `POST /`, `DELETE /:id`

## 6. Connecting the React frontend (next step)

The frontend currently uses `localStorage` (see `src/lib/userStore.js` and
`AuthContext.jsx`) to simulate accounts. To wire it to this real backend:

1. Add a small `src/lib/api.js` in the frontend with a `fetch` wrapper that
   points at `http://localhost:5000/api` and attaches the saved token.
2. In `Register.jsx` / `SignIn.jsx`, replace the `registerUser` / `verifyUser`
   calls with `POST /api/auth/register` and `POST /api/auth/login`.
3. In `AuthContext.jsx`, store the returned `token` + `user` instead of the
   demo user object, and call `PATCH /api/auth/avatar` from `updateAvatar`.
4. Replace the static files in `src/data/*.js` with `fetch` calls to
   `/api/rooms`, `/api/tenants`, `/api/rent`, `/api/complaints` in the
   corresponding pages.

I kept this out of this change since it touches the frontend's existing
logic — happy to do that wiring next if you'd like, once your MongoDB is
running and you've confirmed the API works (e.g. by registering a user with
a tool like Postman or `curl`).

## 7. Quick test with curl

```bash
# Register a super admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Owais Ahmed","email":"owais@nestwell.app","password":"test1234","role":"superadmin"}'

# Log in
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"owais@nestwell.app","password":"test1234","role":"superadmin"}'
```
Copy the `token` from the response and use it for protected routes:
```bash
curl http://localhost:5000/api/rooms -H "Authorization: Bearer <token>"
```
