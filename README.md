# Argonout

**Argonout** is a web application designed for organizing and participating in outdoor games, inspired by Geocaching. Users can join games that involve visiting specific geographic locations and scanning QR codes to confirm their presence. The application also supports creating custom games with configurable locations, QR codes, and time limits. The backend is powered by Spring Boot, PostgreSQL, and REST API, while the frontend uses React. Future updates will include mobile support, containerization with Docker, and deployment to AWS.

## Table of Contents

1. [Key Features](#key-features)
2. [GUI presentation](gui-presentation)
4. [Getting Started](#getting-started)
5. [Prerequisites](#prerequisites)
6. [Setup Instructions](#setup-instructions)
7. [API Endpoints](#api-endpoints)
8. [Technologies Used](#technologies-used)
9. [Development Roadmap](#development-roadmap)
10. [License](#license)

---

## Key Features

1. **Outdoor Game Participation**:
   - View available games on a map in Adventure Mode or play in Free Mode.
   - Scan QR codes at locations to confirm your presence.

2. **Game Organization**:
   - Create custom games as an admin, specifying:
     - Geographic locations.
     - Time limits for game completion.

3. **Progress Tracking**:
   - Real-time tracking via GPS and scanned QR codes.
   - Alerts for completed tasks and remaining time.

4. **Leaderboards and History**:
   - View personal game history and statistics.
   - Compare rankings with other users.

5. **Feedback System**:
   - Send feedback messages as a user.
   - Read and manage feedback messages as an admin.

6. **User Management**:
   - Register and log in securely with JWT authentication.
   - Edit user profiles and account details.

---

## GUI presentation
https://github.com/user-attachments/assets/b72bab4f-92fa-45cb-a5d4-f65556c6db5f


## Getting Started

Follow the steps below to set up and run the **Argonout** application.

### Prerequisites

#### Backend
- Java 11 or later
- PostgreSQL
- Maven

#### Frontend
- Node.js (LTS version) and npm/yarn


## Setup Instructions

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/dminior8/argonout.git
   cd argonout/backend-argonout
   ```

2. Set up PostgreSQL:
   - Create a database named `ArgonoutDB`.
   - Update `application.properties` with your database credentials:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/ArgonoutDB
     spring.datasource.username=yourUsername
     spring.datasource.password=yourPassword
     ```

3. Build and run the backend:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. Backend API base URL: `http://localhost:8080`


### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend-argonout
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the frontend at: `http://localhost:3000`

### Logging in

You can log in using the following credentials for different users:

#### User 1:
- **Username:** `jKowalski`
- **Password:** `Admin123!`

#### User 2:
- **Username:** `aNowak`
- **Password:** `password`

---

## API Endpoints

Here's a summary of the available API endpoints:

### Game Management
| Method | Endpoint                                   | Description                             | Response                        |
|--------|-------------------------------------------|-----------------------------------------|---------------------------------|
| POST   | `/api/game/init/{routeId}`                | Initializes a game for a route.         | Game ID (UUID).                |
| POST   | `/api/game/{gameId}/add-place/{placeId}`  | Adds a place to the game.               | Status message.                |
| POST   | `/api/game/{gameId}/end`                  | Ends the game.                          | Status message.                |
| POST   | `/api/free-game/add-place/{placeId}`      | Adds a place in Free Mode.              | Status message.                |

### League Management
| Method | Endpoint                                   | Description                             | Response                        |
|--------|-------------------------------------------|-----------------------------------------|---------------------------------|
| GET    | `/api/leagues/all`                        | Retrieves all leagues.                  | List of leagues.               |
| GET    | `/api/leagues/{leagueId}`                 | Retrieves users in a league.            | Paginated leaderboard data.    |
| GET    | `/api/leagues/current-player/position`    | Gets the current player's position.     | Player position or `204`.      |

### Authentication
| Method | Endpoint                                   | Description                             | Response                        |
|--------|-------------------------------------------|-----------------------------------------|---------------------------------|
| POST   | `/api/auth/login`                         | Logs in a user.                         | JWT token and user details.    |
| POST   | `/api/auth/register`                      | Registers a new user.                   | Status message.                |
| POST   | `/api/auth/logout`                        | Logs out a user.                        | Status message.                |

### Map and Place Management
| Method | Endpoint                                   | Description                             | Response                        |
|--------|-------------------------------------------|-----------------------------------------|---------------------------------|
| GET    | `/api/places`                             | Retrieves all places.                   | List of places.                |
| GET    | `/api/places/{routeId}`                   | Gets places by route.                   | List of places.                |
| POST   | `/api/map/places/add`                     | Adds a new place (admin only).          | Status message.                |
| PUT    | `/api/map/places/{placeId}`               | Updates a place (admin only).           | Status message.                |
| DELETE | `/api/map/places/{placeId}`               | Deletes a place (admin only).           | Status message.                |
| GET    | `/api/routes/all`                         | Gets all routes.                        | List of routes.                |

### Messages
| Method | Endpoint                                   | Description                             | Response                        |
|--------|-------------------------------------------|-----------------------------------------|---------------------------------|
| POST   | `/api/messages/send`                      | Sends a feedback message.               | Status message.                |
| GET    | `/api/messages/get/all`                   | Retrieves all messages (admin only).    | Paginated list of messages.    |
| DELETE | `/api/messages/{messageId}/delete`        | Deletes a message by ID (admin only).   | Status message.                |

### User Profile Management
| Method | Endpoint                                   | Description                             | Response                        |
|--------|-------------------------------------------|-----------------------------------------|---------------------------------|
| GET    | `/api/users/me`                           | Gets the logged-in user's profile.      | User details.                  |
| PUT    | `/api/users/me`                           | Updates the user's profile.             | Status message.                |
| DELETE | `/api/users/me`                           | Deletes the user's account.             | Status message.                |

---

## Technologies Used

### Backend
- Spring Boot
- Spring Security (JWT)
- Hibernate
- PostgreSQL
- JUnit and Mockito

### Frontend
- React
- Bootstrap
- Axios

---

## Development Roadmap

### Short-Term Goals
1. **Mobile App Development**:
   - Build a mobile app with React Native for QR code scanning and GPS tracking.

2. **Docker Containerization**:
   - Develop Docker images for both backend and frontend.

3. **Cloud Deployment**:
   - Deploy backend and database to AWS (ECS, RDS).
   - Host frontend on AWS S3 + CloudFront.

### Long-Term Goals
1. **Enhanced Game Features**:
   - Multi-team games with collaborative scoring.

2. **Analytics Dashboard**:
   - Provide participation and feedback insights for game organizers.

3. **Scalability**:
   - CI/CD pipelines using GitHub Actions.
   - Auto-scaling and monitoring with AWS CloudWatch.

---

## License

This project is licensed under the [Apache License](https://github.com/dminior8/argonout/blob/main/LICENSE).

---

## Author and Creation Date

- **Author**: Daniel Minior
- **Creation Date**: 27 July 2024
