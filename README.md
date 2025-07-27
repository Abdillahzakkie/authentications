# Authentications

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

A secure, blockchain-agnostic authentication service built with Node.js and TypeScript. This service provides JWT-based authentication with support for multiple blockchain networks, signature verification, and comprehensive user/admin management.

## 📖 About

Authentications is an enterprise-grade authentication microservice designed for Web3 applications that need secure, blockchain-based user verification. Built by Exedos Corp, this service bridges traditional web authentication with blockchain technology, enabling applications to authenticate users through cryptographic signatures while maintaining familiar JWT-based session management.

The service was architected to handle the complexities of multi-chain environments, providing a unified authentication layer that works seamlessly across different blockchain networks. Whether you're building a DeFi platform, NFT marketplace, or any Web3 application, Authentications provides the security and flexibility needed for modern decentralized applications.

**Key Use Cases:**

-   DeFi platforms requiring wallet-based authentication
-   NFT marketplaces with user account management
-   Multi-chain applications needing unified authentication
-   Enterprise Web3 applications requiring role-based access control
-   Any application needing secure blockchain signature verification

## 🚀 Features

-   **Blockchain Authentication**: Support for multiple blockchain networks (Ethereum, Base, etc.)
-   **JWT Token Management**: Secure token generation and validation
-   **Signature Verification**: Cryptographic signature validation for secure logins
-   **Multi-Chain Support**: Configurable support for various blockchain networks
-   **Rate Limiting**: Built-in request rate limiting with Redis
-   **Metrics & Monitoring**: Prometheus metrics integration
-   **Role-Based Access**: Separate admin and user authentication flows
-   **Security**: Comprehensive security middleware (Helmet, CORS, sanitization)
-   **Testing**: Complete test suite with Mocha and Chai
-   **Docker Support**: Containerized deployment ready

## 🛠️ Tech Stack

-   **Runtime**: Node.js with TypeScript
-   **Framework**: Express.js
-   **Database**: MongoDB with Mongoose
-   **Cache**: Redis with IORedis
-   **Blockchain**: Ethers.js for Web3 interactions
-   **Authentication**: JWT with signature verification
-   **Testing**: Mocha, Chai, Mochawesome
-   **Monitoring**: Prometheus metrics
-   **Security**: Helmet, CORS, rate limiting, input sanitization

## 📋 Prerequisites

-   Node.js (v16 or higher)
-   MongoDB
-   Redis
-   Docker (optional)

## 🚀 Quick Start

### Local Development

1. **Clone the repository**

    ```bash
    git clone https://github.com/abdillahzakkie/authentications.git
    cd-authentications
    ```

2. **Install dependencies**

    ```bash
    yarn install
    ```

3. **Environment Setup**

    ```bash
    cp .env.example .env
    # Edit .env with your configuration
    ```

4. **Start development server**
    ```bash
    yarn dev
    ```

### Docker Deployment

1. **Build and run with Docker Compose**
    ```bash
    docker-compose up -d
    ```

## 📝 API Endpoints

### Authentication

-   `POST /api/login` - User/Admin authentication
-   `GET /api/login/verify` - Token verification

### Users

-   `GET /api/users` - List users
-   `POST /api/users` - Create user
-   `GET /api/users/:id` - Get user details
-   `PUT /api/users/:id` - Update user
-   `DELETE /api/users/:id` - Delete user

### Admins

-   `GET /api/admins` - List admins
-   `POST /api/admins` - Create admin
-   `GET /api/admins/:id` - Get admin details
-   `PUT /api/admins/:id` - Update admin
-   `DELETE /api/admins/:id` - Delete admin

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017-auth

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# Blockchain RPC URLs
ETHEREUM_RPC_URL=your-ethereum-rpc
BASE_RPC_URL=your-base-rpc
```

### Supported Blockchain Networks

The service supports multiple blockchain networks configured in `src/constants/allowedChains.ts`:

-   Ethereum Mainnet (Chain ID: 1)
-   Base Mainnet (Chain ID: 8453)
-   Additional networks can be configured as needed

## 🧪 Testing

```bash
# Run all tests
yarn test

# Type checking
yarn ts.check

# Build project
yarn build
```

Test results are generated in the `spec-results/` directory with Mochawesome reports.

## 📊 Monitoring

The service includes Prometheus metrics for monitoring:

-   HTTP request duration
-   Request rate
-   Error rates
-   Database connection status

Metrics are available at `/metrics` endpoint in production mode.

## 🏗️ Project Structure

```
src/
├── app.ts                 # Express app configuration
├── index.ts              # Application entry point
├── constants/            # Constants and utilities
│   ├── allowedChains.ts  # Supported blockchain networks
│   ├── generateLoginSignatureData.ts
│   └── ...
├── controllers/          # Request handlers
├── databases/           # Database connections
├── middleware/          # Custom middleware
├── models/             # Data models
├── routes/             # API routes
│   ├── login/          # Authentication routes
│   ├── users/          # User management
│   └── admins/         # Admin management
└── services/           # Business logic
```

## 🔐 Authentication Flow

1. **Signature Generation**: Client generates a signature using their wallet
2. **Signature Verification**: Server verifies the signature against the user's address
3. **JWT Generation**: Upon successful verification, a JWT token is issued
4. **Token Validation**: Subsequent requests use the JWT for authentication

## 🚀 Deployment

### Production Build

```bash
yarn build
yarn start
```

### Docker

```bash
docker build -t-authentications .
docker run -p 8080:8080-authentications
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**Abdullah Zakariyya** - [@Abdillahzakkie](https://github.com/Abdillahzakkie)

## 🔗 Links

-   [Repository](https://github.com/abdillahzakkie/authentications)
-   [Issues](https://github.com/abdillahzakkie/authentications/issues)
-   [Abdillah Zakariyya](https://github.com/abdillahzakkie)
