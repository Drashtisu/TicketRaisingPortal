#  IT Ticket Management System

A full-stack MERN application designed to manage IT support tickets efficiently. The system provides separate functionality for Admin, Agent, and User roles.

##  Project Overview

The IT Ticket Management System helps organizations manage technical issues through a centralized ticketing platform.

Users can raise tickets, agents can work on assigned tickets, and administrators can manage the entire system.

##  User Roles

### Admin

* Manage users
* Manage departments
* Manage categories
* View all tickets
* Assign tickets to agents
* Track ticket status
* View reports

### Agent

 View assigned tickets
 Start ticket work
 Add work logs
 Update ticket status
 Add resolution
 Resolve tickets

### User

 Create tickets
 View own tickets
 Track ticket status
 View ticket details

##  Features

  JWT-based authentication
  Role-based authorization
 Ticket management
  Department management
  Category management
  Agent assignment
  Work logs
 Ticket status management
  Protected API routes


##  Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd ticket-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

##  Environment Variables

### Backend

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

##  Ticket Flow

```text
User Creates Ticket
        ↓
Admin Reviews Ticket
        ↓
Admin Assigns Agent
        ↓
Agent Starts Work
        ↓
Agent Adds Work Logs
        ↓
Agent Resolves Ticket
        ↓
Ticket Closed
```

##  Deployment

### Frontend

The frontend can be deployed using:

 Netlify
 Vercel

### Backend

The backend can be deployed using:

 Render

### Database

 MongoDB Atlas


