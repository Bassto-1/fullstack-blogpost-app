# Full-Stack Blog Post App

This is a simple full-stack blog application I built to practice working with a React frontend and a Node.js backend.

Users can create an account, log in, and manage their blog posts.

## Features

Register a new account
Login and logout
Create posts
View posts
Edit posts
Delete posts
JWT authentication
Protected post routes
Error handling

## Technologies

### Frontend

React
JavaScript
React Router
CSS
Vite

### Backend

Node.js
Express.js
MongoDB
Mongoose
JWT
bcryptjs

## Project Structure

Project/
├── express-server/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
│
├── .gitignore
└── README.md

````

## How It Works

The frontend is built with React and sends requests to the Express backend.

The backend handles the users and blog posts and connects to MongoDB.

When a user logs in, the backend sends back a JWT token. The frontend uses the token when making requests to protected post routes.

## CRUD

The application supports:

- **Create** posts
- **Read** posts
- **Update** posts
- **Delete** posts

## Running the Project

### Backend

```bash
cd express-server
npm install
npm run dev
````

The backend runs on port `2000`.

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs using Vite.

## Environment Variables

Create a `.env` file inside the `express-server` folder.

```text
PORT=2000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
```

The `.env` file is not uploaded to GitHub.

## What I Practiced

This project helped me practice:

- Building APIs with Express
- Working with MongoDB and Mongoose
- User registration and login
- JWT authentication
- Password hashing
- CRUD operations
- React state management
- React Router
- Connecting a React frontend to a backend
- Error handling
- Using Git and GitHub

## Author

Bassto-1
