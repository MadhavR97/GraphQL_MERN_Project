# MERN GraphQL Authentication App

A modern MERN stack application with GraphQL, Next.js, and authentication features.

## Features

- **Authentication**: Complete login/signup functionality with JWT tokens
- **GraphQL API**: Apollo Server with GraphQL schema and resolvers
- **MongoDB**: User data storage with Mongoose ODM
- **Next.js**: Modern React framework with App Router
- **Shadcn UI**: Beautiful UI components with dark theme
- **Responsive Design**: Works on mobile and desktop
- **Dashboard**: Protected dashboard with sidebar navigation

## Tech Stack

- **Frontend**: Next.js 16.1.1, React 19.2.3, TypeScript
- **UI Library**: Shadcn UI, Tailwind CSS
- **Backend**: Node.js, Apollo Server, GraphQL
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens, bcrypt for password hashing

## Project Structure

```
GraphQL/
├── client/                 # Next.js frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   │   ├── auth/      # Authentication pages
│   │   │   └── page.tsx   # Dashboard page
│   │   ├── components/    # UI components
│   │   └── lib/           # GraphQL client setup
│   └── package.json
└── server/                 # GraphQL backend
    ├── models/            # Mongoose models
    ├── schema/            # GraphQL schema
    ├── server.js          # Apollo Server setup
    └── package.json
```

## Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/graphql-auth
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Visit `http://localhost:3000` in your browser
2. Create an account using the signup form
3. Login with your credentials
4. Access the protected dashboard

## API Endpoints

### GraphQL
- `http://localhost:4000/graphql` - GraphQL endpoint

### GraphQL Operations

#### Signup
```graphql
mutation Signup($username: String!, $email: String!, $password: String!) {
  signup(username: $username, email: $email, password: $password) {
    token
    user {
      id
      username
      email
      createdAt
    }
  }
}
```

#### Login
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      username
      email
      createdAt
    }
  }
}
```

## Environment Variables

### Server (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.