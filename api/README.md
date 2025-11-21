📘 Quiz API (Test Project)
Overview

This is a NestJS-based Quiz API created as a test project.
It allows users to create quizzes, submit answers, and view scores.
The project includes a basic authentication system with roles: Admin and User.

⚠️ Note: This is a test task, so the authentication and role system are intentionally basic.

Features

Admins can create quizzes and questions

Users can start quizzes, submit answers, and view scores

Role-based access control

Validation using DTOs (class-validator)

Unit tests with Jest

Swagger documentation for API endpoints

Quick Start

Clone the repository:

git clone <repo-url>
cd api


Install dependencies:

npm install


Run the project in development mode:

npm run start:dev

Swagger
http://localhost:3000/api-doc#/

Run tests:

npm run test

Authentication

Use the /auth endpoint to create users.

You can create Admin or User accounts.

Admins can access admin-only routes, while Users can take quizzes.

API Usage
Admin Endpoints

POST /quizzes → Create a new quiz

PATCH /quizzes/:id → Edit a quiz

POST /questions → Create questions

User Endpoints

Important part User should start the quiz and then submit

PATCH /quizzes/:id/start → Start a quiz (provide quiz ID)

PATCH /quizzes/submit → Submit answers for a quiz

GET /quizzes/score → View user’s quiz scores

All endpoints require authentication via JWT, except public routes if any.

Testing

Run all tests:

npm run test

Notes

This is a test project, so authentication and roles are minimal.

You can freely explore creating quizzes, adding questions, taking quizzes, and viewing scores.

Environment variables (like PORT) are optional for this test project.