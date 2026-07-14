# Team Task Tracker

A full-stack task management application that allows users to create teams, assign tasks, and manage team work efficiently.

## Tech Stack

### Frontend
- React
- CSS

### Backend
- Flask
- SQLAlchemy
- SQLite
- bcrypt (password hashing)

---

## Local Setup

### Prerequisites

Make sure you have the following installed:

- Node.js
- Python 3
- Git

---

## Backend Setup

Open a terminal and run:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The backend will start on `http://127.0.0.1:5000`.

---

## Frontend Setup

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.

---

## How to Use

### Admin Account

The admin can:
- Create teams
- Edit teams
- Delete teams

**Credentials**

- **Username:** `admin`
- **Password:** `admin123`

### User Account

Users can:
- Log in to their assigned team
- Create tasks
- Edit tasks
- Delete tasks
- Update task status
- View personal and team tasks

---

## Features

- User authentication with bcrypt password hashing
- Personal and team task management
- Team creation and management
- Task assignment
- Task status updates
- Admin dashboard
- Profile page
- React frontend with Flask REST API
- SQLite database
