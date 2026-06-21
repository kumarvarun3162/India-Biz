# India Biz Listing

A subscription platform for Indian small businesses to create professional online listings.
₹149/month for basic, ₹399/month for premium.

## Tech stack

| Side     | Technology                              |
|----------|-----------------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS          |
| Backend  | Python 3.11 + FastAPI + Motor           |
| Database | MongoDB Atlas (free M0 tier)            |
| Auth     | JWT (python-jose) + bcrypt (passlib)    |
| Payments | Razorpay                                |
| Email    | Brevo (Sendinblue)                      |
| Images   | Cloudinary                              |
| Deploy   | Netlify (client) + Railway (server)     |

## Local setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account (free)

### 1 — Clone and set up the client

```bash
git clone https://github.com/yourusername/india-biz-listing.git
cd india-biz-listing/client
npm install
cp .env.example .env        # then edit VITE_API_URL
npm run dev                  # runs at http://localhost:5173
```

### 2 — Set up the server

```bash
cd ../server
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env         # then fill in all values
uvicorn app.main:app --reload  # runs at http://localhost:8000
```

### 3 — API documentation

Visit `http://localhost:8000/docs` for the auto-generated Swagger UI.

## Environment variables

### server/.env

| Variable          | Required | Description                                |
|-------------------|----------|--------------------------------------------|
| `MONGODB_URI`     | Yes      | MongoDB Atlas connection string            |
| `JWT_SECRET`      | Yes      | 64+ character random string                |
| `CLIENT_URL`      | Yes      | React dev URL (http://localhost:5173)       |
| `DB_NAME`         | No       | Database name (default: indiabizdb)        |

### client/.env

| Variable        | Required | Description                          |
|-----------------|----------|--------------------------------------|
| `VITE_API_URL`  | Yes      | FastAPI server URL                   |

## Project structure

```
india-biz-listing/
├── client/          → React + Vite (Netlify)
└── server/          → FastAPI (Railway)
```