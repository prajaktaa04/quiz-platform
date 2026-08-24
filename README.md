# Quiz Management & Assessment Platform

A full-stack MERN-based Quiz Management and Assessment Platform designed to provide a complete online quiz experience for students and administrators.

The platform allows administrators to manage students, categories, quizzes, and questions, while students can browse quizzes, attempt assessments, track their performance, review previous attempts, and compete on a leaderboard.

---

## 🚀 Features

### 👨‍💼 Admin

- Admin authentication and login
- Admin dashboard
- Student management
- Activate/deactivate student accounts
- Delete students
- Category management
- Create categories
- Edit categories
- Delete categories
- Quiz management
- Create quizzes
- Edit quizzes
- Delete quizzes
- Publish/unpublish quizzes
- Question management
- Create questions
- Edit questions
- Delete questions
- Configure question difficulty and marks
- View student attempts
- View student performance
- Quiz analytics
- Platform performance monitoring

---

### 👨‍🎓 Student

- Student registration
- Student login
- Forgot password
- Reset password
- Browse published quizzes
- Search and filter quizzes
- View quiz details
- Start quiz attempts
- Timed quiz experience
- Question navigation
- Answer selection
- Automatic quiz timeout handling
- Quiz submission
- Automatic score calculation
- Pass/fail evaluation
- Correct, incorrect, and unanswered statistics
- View previous attempts
- Review completed attempts
- View performance/progress
- Leaderboard

---

## 🔐 Authentication & Authorization

The platform uses **JWT-based authentication** with role-based access control.

### Roles

- `ADMIN`
- `STUDENT`

Protected backend routes verify the JWT token before allowing access.

Role-based authorization ensures that:

- Students can access student functionality.
- Administrators can access administrative functionality.
- Students cannot access admin-only resources.
- Students can only access their own quiz attempts.

Passwords are securely hashed using **bcrypt**.

---

## 🛠️ Technology Stack

### Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt.js

### Database

- MongoDB
- Mongoose

### Development Tools

- Visual Studio Code
- Git
- GitHub
- MongoDB

---

## 🏗️ System Architecture

The application follows a client-server architecture:

```text
                    ┌─────────────────────┐
                    │      Student        │
                    │      / Admin        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │       + Vite        │
                    └──────────┬──────────┘
                               │
                         REST API / JWT
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │      Node.js        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │     Database        │
                    └─────────────────────┘