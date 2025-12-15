# Employee Feedback Dashboard

A full-stack internal employee feedback system built with React, Express, and MongoDB.

## 🚀 Features

### Frontend
- **Feedback Form** (`/`) - Submit employee feedback with name, department, and message
- **Admin Dashboard** (`/admin`) - View all feedback in a table with filtering by department
- Real-time validation and error handling
- Responsive design with loading and empty states

### Backend
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- CORS enabled for frontend communication
- Comprehensive error handling and validation
- Request logging with Morgan

## 📁 Project Structure

```
/backend
  /src
    /config
      db.js                    # MongoDB connection
    /controllers
      feedbackController.js    # Business logic
    /middleware
      errorHandler.js          # Central error handler
    /models
      Feedback.js              # Mongoose schema
    /routes
      feedbackRoutes.js        # API routes
    server.js                  # Express app entry
  .env.example
  package.json

/frontend
  /src
    /components
      FeedbackForm.jsx         # Feedback submission form
      AdminDashboard.jsx       # Admin view with filtering
    /services
      api.js                   # Axios API client
    App.jsx                    # Main app with routing
    App.css                    # Styles
    main.jsx                   # React entry
  .env.example
  index.html
  package.json
  vite.config.js

README.md
```

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- dotenv, cors, morgan, nodemon

**Frontend:**
- React 18 + Vite
- React Router v6
- Axios

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Full-Stack-Mini-Assignment
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee-feedback
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

Backend will run on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

Frontend will run on **http://localhost:5173**

### 4. Access the Application

- **Feedback Form:** http://localhost:5173/
- **Admin Dashboard:** http://localhost:5173/admin

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

---

#### 2. Create Feedback
```http
POST /feedback
```

**Request Body:**
```json
{
  "name": "John Doe",
  "department": "Engineering",
  "message": "Great work environment!"
}
```

**Valid Departments:**
- Engineering
- HR
- Sales
- Marketing
- Finance
- Operations

**Success Response (201):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "name": "John Doe",
  "department": "Engineering",
  "message": "Great work environment!",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Please provide name, department, and message"
}
```

---

#### 3. Get All Feedback
```http
GET /feedback
```

**Optional Query Parameters:**
- `department` - Filter by department (e.g., `?department=Engineering`)

**Success Response (200):**
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "department": "Engineering",
    "message": "Great work environment!",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Jane Smith",
    "department": "HR",
    "message": "Excellent team collaboration",
    "createdAt": "2024-01-15T09:15:00.000Z"
  }
]
```

---

#### 4. Get Feedback by ID
```http
GET /feedback/:id
```

**Success Response (200):**
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "name": "John Doe",
  "department": "Engineering",
  "message": "Great work environment!",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Feedback not found"
}
```

---

## 🧪 Testing with cURL

### Create Feedback
```bash
curl -X POST http://localhost:5000/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "department": "Engineering",
    "message": "Great work environment!"
  }'
```

### Get All Feedback
```bash
curl http://localhost:5000/feedback
```

### Get Feedback Filtered by Department
```bash
curl "http://localhost:5000/feedback?department=Engineering"
```

### Get Feedback by ID
```bash
curl http://localhost:5000/feedback/65f1a2b3c4d5e6f7g8h9i0j1
```

### Health Check
```bash
curl http://localhost:5000/health
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon (auto-reload)
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server with HMR
```

### Production Build
```bash
cd frontend
npm run build  # Creates optimized build in /dist
npm run preview  # Preview production build
```

## 📝 Validation Rules

### Feedback Model
- **name**: Required, max 80 characters
- **department**: Required, must be one of: Engineering, HR, Sales, Marketing, Finance, Operations
- **message**: Required, max 1000 characters
- **createdAt**: Auto-generated timestamp

## 🎨 Features Implemented

✅ POST /feedback - Save feedback to MongoDB  
✅ GET /feedback - Retrieve all feedback (sorted by newest first)  
✅ GET /feedback?department=X - Filter by department  
✅ MongoDB storage with Mongoose schemas  
✅ Field validation and error handling  
✅ CORS enabled for frontend  
✅ Environment variables configuration  
✅ JSON-only responses  
✅ React form with validation  
✅ Admin dashboard with filtering  
✅ Loading and error states  
✅ Responsive design  

## 📄 License

ISC

## 👤 Author

Your Name

---

**Happy Coding! 🎉**
