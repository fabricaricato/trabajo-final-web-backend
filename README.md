# 📚 Book Manager API

A RESTful API built with **Express 5** and **TypeScript** for managing a personal book collection. It features **JWT-based authentication**, input validation with **Zod**, and data persistence with **MongoDB** (Mongoose).

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Books](#books)
- [Data Models](#data-models)
- [Error Handling](#error-handling)

---

## Tech Stack

| Technology                                                                | Purpose                         |
| ------------------------------------------------------------------------- | ------------------------------- |
| [Express 5](https://expressjs.com/)                                       | Web framework                   |
| [TypeScript](https://www.typescriptlang.org/)                             | Type-safe JavaScript            |
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) | Database & ODM                  |
| [JSON Web Tokens](https://jwt.io/)                                        | Authentication                  |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs)                        | Password hashing                |
| [Zod](https://zod.dev/)                                                   | Request body validation         |
| [CORS](https://www.npmjs.com/package/cors)                                | Cross-Origin Resource Sharing   |
| [dotenv](https://www.npmjs.com/package/dotenv)                            | Environment variable management |

---

## Project Structure

```
src/
├── config/
│   └── database.ts          # MongoDB connection setup
├── controllers/
│   ├── auth.controller.ts    # Register & Login logic
│   └── book.controller.ts    # CRUD operations for books
├── interfaces/
│   ├── IBook.ts              # Book type definition
│   ├── IPayload.ts           # JWT payload type
│   ├── IRequestWithUser.ts   # Extended Request with user data
│   └── IUser.ts              # User type definition
├── middleware/
│   └── authMiddleware.ts     # JWT token validation
├── models/
│   ├── bookModel.ts          # Mongoose Book schema
│   └── userModel.ts          # Mongoose User schema
├── routes/
│   ├── authRouter.ts         # Auth route definitions
│   └── bookRouter.ts         # Book route definitions
├── validators/
│   ├── bookValidate.ts       # Zod schema for books
│   └── userValidate.ts       # Zod schema for users
└── index.ts                  # Application entry point
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- A running [MongoDB](https://www.mongodb.com/) instance (local or cloud, e.g. [MongoDB Atlas](https://www.mongodb.com/atlas))

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd book-management-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables** (see next section)

---

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
URI_DB=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
PORT=3000
JWT_SECRET=your_super_secret_key
```

| Variable     | Description                        |
| ------------ | ---------------------------------- |
| `URI_DB`     | MongoDB connection URI             |
| `PORT`       | Port number for the server         |
| `JWT_SECRET` | Secret key used to sign JWT tokens |

---

## Running the Server

Start the development server with hot-reload:

```bash
npm run dev
```

You should see the following output in the terminal:

```
Server listening on port: 3000
🟢 CONNECTED SUCCESSFULLY 🟢
```

---

## API Endpoints

> **Base URL:** `http://localhost:<PORT>/api`

### Authentication

These endpoints are **public** and do not require a token.

#### `POST /api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "secret123"
}
```

| Field      | Type     | Required | Constraints                     |
| ---------- | -------- | -------- | ------------------------------- |
| `username` | `string` | Yes      | Min. 2 characters               |
| `email`    | `string` | Yes      | Must be a valid email           |
| `password` | `string` | Yes      | Min. 6 characters               |
| `role`     | `string` | No       | `"user"` (default) or `"admin"` |

**Success Response** — `201 Created`:

```json
{
  "success": true,
  "data": "User registered successfully!"
}
```

**Error Response** — `400 Bad Request` (email already registered):

```json
{
  "success": false,
  "message": "Email already registered, please login with it."
}
```

---

#### `POST /api/auth/login`

Authenticate an existing user and receive a JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success Response** — `200 OK`:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

> ⚠️ The token expires in **10 minutes**. Include it in the `Authorization` header for protected routes.

---

### Books

All book endpoints are **protected** and require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

#### `GET /api/books`

Retrieve all books. Supports optional query parameters for filtering.

**Query Parameters:**

| Parameter  | Type     | Description                                             |
| ---------- | -------- | ------------------------------------------------------- |
| `author`   | `string` | Filter by author name (case-insensitive, partial match) |
| `genre`    | `string` | Filter by exact genre                                   |
| `minPages` | `number` | Filter books with at least this many pages              |

**Example Request:**

```
GET /api/books?author=tolkien&minPages=200
```

**Success Response** — `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "_id": "664f1a2b3c4d5e6f7a8b9c0d",
      "title": "The Lord of the Rings",
      "author": "J.R.R. Tolkien",
      "date": "1954-07-29T00:00:00.000Z",
      "genre": ["Fantasy", "Adventure"],
      "pages": 1178,
      "editorial": "Allen & Unwin",
      "user": {
        "_id": "664f1a2b3c4d5e6f7a8b9c0e",
        "username": "johndoe",
        "email": "john@example.com",
        "role": "user"
      }
    }
  ]
}
```

---

#### `POST /api/books`

Create a new book entry. The authenticated user is automatically associated as the book's owner.

**Request Body:**

```json
{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "date": "1937-09-21",
  "genre": ["Fantasy"],
  "pages": 310,
  "editorial": "Allen & Unwin"
}
```

| Field       | Type                | Required | Constraints                |
| ----------- | ------------------- | -------- | -------------------------- |
| `title`     | `string`            | Yes      | Min. 2 characters          |
| `author`    | `string`            | Yes      | Min. 2 characters          |
| `date`      | `string` (ISO date) | Yes      | Must be a valid date       |
| `genre`     | `string[]`          | Yes      | Between 1 and 5 items      |
| `pages`     | `number`            | No       | Must be a positive integer |
| `editorial` | `string`            | No       | —                          |

**Success Response** — `201 Created`:

```json
{
  "success": true,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "date": "1937-09-21T00:00:00.000Z",
    "genre": ["Fantasy"],
    "pages": 310,
    "editorial": "Allen & Unwin",
    "user": "664f1a2b3c4d5e6f7a8b9c0e"
  }
}
```

---

#### `PATCH /api/books/:id`

Update an existing book by its ID. Only the provided fields will be updated (partial update).

**URL Parameters:**

| Parameter | Description                  |
| --------- | ---------------------------- |
| `id`      | MongoDB ObjectId of the book |

**Request Body** (all fields are optional):

```json
{
  "pages": 320,
  "editorial": "HarperCollins"
}
```

**Success Response** — `201 Created`:

```json
{
  "success": true,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "date": "1937-09-21T00:00:00.000Z",
    "genre": ["Fantasy"],
    "pages": 320,
    "editorial": "HarperCollins",
    "user": "664f1a2b3c4d5e6f7a8b9c0e"
  }
}
```

---

#### `DELETE /api/books/:id`

Delete a book by its ID.

**URL Parameters:**

| Parameter | Description                  |
| --------- | ---------------------------- |
| `id`      | MongoDB ObjectId of the book |

**Success Response** — `201 Created`:

```json
{
  "success": true,
  "data": {
    "_id": "664f1a2b3c4d5e6f7a8b9c0d",
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "..."
  }
}
```

**Error Response** — `400 Bad Request` (invalid ID format):

```json
{
  "success": false,
  "error": "ID error, please verify your ID input"
}
```

**Error Response** — `404 Not Found`:

```json
{
  "success": false,
  "error": "Book not found in database"
}
```

---

## Data Models

### User

| Field       | Type     | Default      | Notes                               |
| ----------- | -------- | ------------ | ----------------------------------- |
| `username`  | `String` | `"New User"` | Display name                        |
| `email`     | `String` | —            | Unique, required                    |
| `password`  | `String` | —            | Hashed with bcrypt (10 salt rounds) |
| `role`      | `String` | `"user"`     | Enum: `"user"`, `"admin"`           |
| `createdAt` | `Date`   | Auto         | Mongoose timestamp                  |
| `updatedAt` | `Date`   | Auto         | Mongoose timestamp                  |

### Book

| Field       | Type       | Required | Notes                     |
| ----------- | ---------- | -------- | ------------------------- |
| `title`     | `String`   | Yes      | Trimmed                   |
| `author`    | `String`   | Yes      | Trimmed                   |
| `date`      | `Date`     | Yes      | Publication date          |
| `genre`     | `String[]` | Yes      | Array of genres           |
| `pages`     | `Number`   | No       | Minimum value: 1          |
| `editorial` | `String`   | No       | Trimmed                   |
| `user`      | `ObjectId` | Yes      | Reference to `User` model |

---

## Error Handling

All endpoints return a consistent JSON response format:

**Success:**

```json
{
  "success": true,
  "data": "..."
}
```

**Error:**

```json
{
  "success": false,
  "error": "Error description"
}
```

**Validation errors** (Zod) return field-level error details:

```json
{
  "success": false,
  "error": {
    "title": ["String must contain at least 2 character(s)"],
    "genre": ["Array must contain at least 1 element(s)"]
  }
}
```

---

## API Testing

This project includes a [Bruno](https://www.usebruno.com/) collection inside the `peticiones-bruno-tp-final/` directory with pre-configured requests for all endpoints. Import the folder into Bruno to test the API quickly.

---

## Author

**Fabrizio Caricato**
