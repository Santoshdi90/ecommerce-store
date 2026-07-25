# ShopEase - Online Store Project

A full stack e-commerce web application built as part of my Full Stack Development course. The app lets users browse products, add them to a cart, and place orders through a simulated checkout.

## Features

- User registration and login (with JWT authentication)
- Browse all products with search and category filter
- View product details page
- Add to cart / remove from cart / update quantity
- Checkout with shipping address form
- View past orders
- Cart count shown in navbar

## Tech Stack

**Frontend:**
- React 18
- React Router v6
- Axios (for API calls)
- Context API (for auth and cart state)
- Vanilla CSS

**Backend:**
- Node.js
- Express.js
- bcryptjs (password hashing)
- JSON Web Tokens (JWT) for auth
- UUID for unique IDs
- JSON flat-file as database (no external DB required)

## Project Structure

```
ecommerce-store/
├── client/             # React frontend
│   └── src/
│       ├── components/ # Navbar, ProductCard, CartItem
│       ├── context/    # AuthContext, CartContext
│       └── pages/      # Home, ProductDetail, Cart, Checkout, Login, Register, Orders
└── server/             # Express backend
    ├── routes/         # auth, products, cart, orders
    ├── middleware/     # JWT auth middleware
    └── data/           # JSON flat-file storage
```

## Setup Instructions

### 1. Install backend dependencies

```bash
cd server
npm install
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Start the backend server

```bash
cd server
npm start
```

The API runs at `http://localhost:5001`

### 4. Start the React frontend

Open a new terminal:

```bash
cd client
npm start
```

The app opens at `http://localhost:3000`

> Make sure both are running at the same time.

## API Endpoints

| Method | Route | Description | Auth Required |
|--------|-------|-------------|:---:|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/products | List all products | No |
| GET | /api/products/:id | Get product by ID | No |
| GET | /api/cart | Get user's cart | Yes |
| POST | /api/cart/add | Add item to cart | Yes |
| PUT | /api/cart/update | Update item quantity | Yes |
| DELETE | /api/cart/remove/:id | Remove item | Yes |
| POST | /api/orders/checkout | Place order | Yes |
| GET | /api/orders | Get order history | Yes |

## Notes

- No real payment gateway - checkout is simulated
- Data is stored in JSON files (users.json, orders.json) inside `server/data/`
- 12 products pre-seeded across Electronics, Clothing, and Home categories
- Passwords are hashed using bcrypt before storage
- JWT tokens expire after 7 days

## What I Learned

- How to build and consume REST APIs
- Managing authentication state across a React app using Context API
- Cart logic: adding, updating quantities, removing items
- Structuring a full stack project with separated client and server
- Handling JWT tokens on the frontend (localStorage + Authorization header)
- Basic Express.js routing and middleware
