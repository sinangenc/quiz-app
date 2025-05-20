# Quiz App

This repository contains quiz app "Life in Germany (Leben in Deutschland)", designed to help users prepare for the German citizenship test.



## API Endpoints

| Method | Endpoint                | Description                                                                       |
|--------|-------------------------|-----------------------------------------------------------------------------------|
| GET    | `/admin/questions`      | Returns all quiz questions.                                                       |
| POST   | `/admin/questions`      | Creates a new quiz question.                                                      |
| GET    | `/admin/questions/{id}` | Returns a specific quiz question.                                                 |
| DELETE | `/admin/questions/{id}` | Deletes a specific quiz question.                                                 |
| GET    | `/states`               | Returns all states(Bundesländer).                                                 |
| GET    | `/test/{state}`         | Returns a sample test for a given state (Bundesland).                             |
| POST   | `/test/check`           | Checks the user's answers for a test and returns the result.                      |
| GET    | `/practice`             | Returns a single practice question with the correct answer for training purposes. |
| POST   | `/auth/login`           | Authenticates user credentials and returns a JWT token for secure access.         |
| POST   | `/auth/register`        | Registers a new user with provided details.                                       |
| GET    | `/users/me`             | Returns the authenticated user's profile information.                             |
| DELETE | `/users/me`             | Deletes the authenticated user.                                                   |


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
