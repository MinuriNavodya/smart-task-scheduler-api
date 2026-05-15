# Smart Task Scheduler API

## Project Description

Students often struggle to manage multiple tasks with deadlines and priority levels. Without a centralized system, tracking progress and task status becomes inefficient, leading to disorganized workflows and missed submissions.

This project provides a structured backend solution to streamline task organization and improve productivity through a RESTful API.

---

# Proposed Solution

A RESTful backend API built using Node.js and Express.js that allows students to:

- Register and log in securely
- Create and manage tasks
- Organize tasks into categories
- Track task priorities and status
- Monitor deadlines and upcoming work

The system gives users full visibility and control over their workload.

---

# Features

- User registration and login using JWT authentication
- Create, Read, Update, and Delete tasks
- Create, Read, Update, and Delete categories
- Filter tasks by status and priority
- Search tasks using keywords
- View upcoming tasks due within the next 7 days
- Task statistics:
  - Total tasks
  - Completed tasks
  - Pending tasks
  - Overdue tasks
  - Completion rate
- Protected routes using JWT middleware
- Proper error handling and validation

---

# Technologies Used

| Technology | Purpose |
|------------|---------|
| Node.js | JavaScript runtime |
| Express.js | Web framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| JWT | User authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variable management |
| cors | Cross-origin resource sharing |
| nodemon | Auto restart during development |
| Postman | API testing |

---

# Folder Structure

```text
TaskManagerAPI/
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   └── taskController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Category.js
│   └── Task.js
│
├── routes/
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   └── taskRoutes.js
│
├── .env
├── package.json
├── package-lock.json
└── server.js
```

---

# API Endpoints

## Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login user |

---

## Task Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get single task |
| POST | /api/tasks | Create new task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

---

## Category Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | Get all categories |
| POST | /api/categories | Create category |
| PUT | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete category |

---

# Setup Instructions

## 1. Clone Repository

```bash
git clone <your-github-repository-link>
```

---

## 2. Navigate to Project Folder

```bash
cd TaskManagerAPI
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Create .env File

Create a `.env` file in the root directory and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 5. Start the Server

```bash
npm start
```

OR

```bash
node server.js
```

---

# API Testing

All API endpoints were tested using Postman.

---

# Future Improvements

- React frontend integration
- Email reminders
- Task notifications
- Calendar integration
- User profile management

---

# Author

Minuri Navodya

2022/ICT/22

IT2234(P)
