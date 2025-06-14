# Quiz App

This repository contains **Quiz App "Life in Germany (Leben in Deutschland)"**, designed to help users prepare for the German citizenship test by simulating real exam-like questions.

The project is composed of two main parts:

- **Frontend:** A modern Next.js application that provides an intuitive and user-friendly interface for practicing quizzes, viewing results, and navigating through practice/test modes.
- **Backend:** A secure Spring Boot REST API that responsible for user authentication, quiz and user management, scoring logic, and database interactions.


## Key Features

- **User authentication** via JWT (login & register)
- **Role-based access** for users and admins
- **Admin panel** to manage users and quiz questions
- **Practice & test modes** to simulate real test experience
- Support for multiple question types:  
  - **Image-based** or **text-only** questions  
  - **General** or **state-specific** question categories
- Fully containerized with **Docker Compose**
- **CI/CD with GitHub Actions**: Docker images are built and deployed to DigitalOcean App Platform via DO Container Registry

## Live Demo

You can access the live deployment of the application here:

- **Frontend:** [https://quiz-app-frontend-6zy4y.ondigitalocean.app](https://quiz-app-frontend-6zy4y.ondigitalocean.app)
- **Backend API:** [https://quiz-app-backend-6zy4y.ondigitalocean.app](https://quiz-app-backend-6zy4y.ondigitalocean.app)

You can use the following test users to explore the app:
- **Normal User:** `user@test.com` / `password123`
- **Admin User:** `admin@test.com` / `admin1234`


## Setup & How to Run

1. **Clone the repository:**

```bash
git clone https://github.com/sinangenc/quiz-app.git
cd quiz-app
```

2. **Start the application using Docker Compose:**

```bash
docker-compose up --build
```
This command will build and start both the frontend and backend services.

3. **Access the Application:**

Once the containers are up and running, the frontend should be accessible at [http://localhost:3000](http://localhost:3000).



## Backend API Endpoints

### 🔐 Authentication
| Method | Endpoint              | Description                                                   |
|--------|-----------------------|---------------------------------------------------------------|
| POST   | `/auth/login`         | Authenticates user credentials and returns a JWT token.       |
| POST   | `/auth/register`      | Registers a new user.                                         |

### 👤 User Profile (Authenticated Users)
| Method | Endpoint                  | Description                                     |
|--------|---------------------------|-------------------------------------------------|
| GET    | `/users/me`               | Returns the authenticated user's profile.       |
| PUT    | `/users/me`               | Updates the authenticated user's profile.       |
| PUT    | `/users/me/password`      | Updates the authenticated user's password.      |
| DELETE | `/users/me`               | Deletes the authenticated user.                 |
| GET    | `/quiz-results`           | Returns quiz results of the authenticated user. |

### 🧪 Quiz & Test
| Method | Endpoint           | Description                                                    |
|--------|--------------------|----------------------------------------------------------------|
| GET    | `/states`          | Returns all states (Bundesländer).                             |
| GET    | `/test/{state}`    | Returns a sample test for a given state.                       |
| POST   | `/test/check`      | Checks user's test answers and returns the result.             |
| GET    | `/practice`        | Returns a practice question with the correct answer.           |

### 🛠️ Admin – Questions Management
| Method | Endpoint                     | Description                          |
|--------|------------------------------|--------------------------------------|
| GET    | `/admin/questions`           | Returns all quiz questions.          |
| POST   | `/admin/questions`           | Creates a new quiz question.         |
| GET    | `/admin/questions/{id}`      | Returns a specific quiz question.    |
| PUT    | `/admin/questions/{id}`      | Updates a specific quiz question.    |
| DELETE | `/admin/questions/{id}`      | Deletes a specific quiz question.    |

### 👥 Admin – User Management
| Method | Endpoint                              | Description                               |
|--------|---------------------------------------|-------------------------------------------|
| GET    | `/admin/users`                        | Returns all users.                        |
| POST   | `/admin/users`                        | Creates a new user.                       |
| GET    | `/admin/users/{id}`                   | Returns a specific user.                  |
| PUT    | `/admin/users/{id}`                   | Updates a specific user.                  |
| DELETE | `/admin/users/{id}`                   | Deletes a specific user.                  |
| GET    | `/admin/users/roles`                  | Returns available user roles.             |
| PUT    | `/admin/users/{id}/activate`          | Activates a user account.                 |
| PUT    | `/admin/users/{id}/deactivate`        | Deactivates a user account.               |
| PUT    | `/admin/users/{id}/change-password`   | Updates the password of a specific user.  |

### 📊 Admin – Dashboard
| Method | Endpoint                    | Description                             |
|--------|-----------------------------|-----------------------------------------|
| GET    | `/admin/dashboard/stats`    | Returns statistics for admin dashboard. |
