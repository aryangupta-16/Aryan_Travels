# Aryan Travels Backend

Spring Boot backend for Aryan Travels application with MongoDB and JWT authentication.

## 🚀 Features
- User Registration & Login with JWT authentication
- MongoDB integration for user data storage
- Password encryption using BCrypt
- CORS enabled for frontend integration
- Protected routes with JWT validation
- Role-based access control

## 📋 Prerequisites
- Java 17 or higher
- Maven 3.6+
- MongoDB (running on localhost:27017)

## 🛠️ Setup Instructions

### 1. Install MongoDB
```bash
# Download and install MongoDB Community Edition
# Start MongoDB service
mongod --dbpath /path/to/your/db
```

### 2. Run the Application
```bash
cd backend
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

## 📡 API Endpoints

### Authentication Endpoints
#### POST /api/auth/signup
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login existing user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Endpoints (Require JWT Token)
#### GET /api/user/profile
Get current user profile
```
Authorization: Bearer <jwt-token>
```

#### GET /api/user/dashboard
Get user dashboard data
```
Authorization: Bearer <jwt-token>
```

## 🔧 Configuration
- **Server Port**: 8080
- **MongoDB URI**: mongodb://localhost:27017/aryan_travels
- **JWT Secret**: Configured in application.yml
- **JWT Expiration**: 24 hours
- **CORS**: Allows http://localhost:3000

## 🗄️ Database Schema
### Users Collection
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String (unique)",
  "password": "String (encrypted)",
  "role": "String (default: USER)",
  "enabled": "Boolean (default: true)",
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime"
}
```

## 🔐 JWT Token Structure
```json
{
  "sub": "user@example.com",
  "userId": "user-id",
  "role": "USER",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 🧪 Testing
### Test Authentication
```bash
# Test server
curl http://localhost:8080/api/auth/test

# Register user
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'

# Login user
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'

# Get user profile (replace <jwt-token> with your token)
curl -H "Authorization: Bearer <jwt-token>" http://localhost:8080/api/user/profile
```
