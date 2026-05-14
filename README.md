# smart-task-scheduler-api
Students often struggel to manage multiple task with deadlines and prioritize importance levels. Without a centralized system, tracking progress and status becomes inefficient. Its leading to disorganized workflows and missed submissions. This projects provides a structured backend solution to streamline task organization and improve productivity. 

--Proposed Solution
A RESTful backend API built with Node.js and Express.js that allows students to register, log in, and manage their tasks and categories. Each task can be assigned a priority level, status, due date, and category — giving students full visibility and control over their workload.

--Features

1.User registration and login with JWT authentication
2.Create, Read, Update and Delete tasks
3.Create, Read, Update and Delete categories
4.Filter tasks by status, priority and keyword search
5.View upcoming tasks due within the next 7 days
6.Task statistics — total count, by status, overdue count, completion rate
7.Protected routes using JWT middleware
8.Proper error handling and validation

Technologies Used
Technology         Purpose
Node.js            JavaScript runtime
Express.js         Web framework
MongoDB            NoSQL database
Mongoose           MongoDB object modeling
JWT                User authentication via token
bcryptjs           Password hashing
dotenv             Environment variable management
cors               Cross-origin resource sharing
nodemon            Auto-restart during development
Postman            API testing

Folder Structure
TaskManagerAPI/
├── controllers/
│   ├── authController.js
│   ├── categoryController.js
│   └── taskController.js
├── models/
│   ├── User.js
│   ├── Category.js
│   └── Task.js
├── routes/
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   └── taskRoutes.js
├── middleware/
│   └── authMiddleware.js
├── server.js
├── .env
└── package.json
