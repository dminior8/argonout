# Argonout

**Argonout** is a comprehensive platform for organizing and participating in outdoor games inspired by Geocaching. It allows users to visit specific locations, scan QR codes to confirm their presence, and track their progress and also supports creating custom games with configurable locations, QR codes, and time limits. The backend is powered by Spring Boot, PostgreSQL, and REST API, while the web application frontend uses React and mobile app uses React Native. Future updates will include containerization with Docker and deployment to AWS.

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



## Key Features

1. **Outdoor Game Participation**:
   - Participate in games with predefined routes or free exploration mode.
   - Use QR codes and user locations to confirm visits to specific locations.
   - Receive real-time notifications for game progress.

2. **Game Organization**:
   - Create custom games as an admin, specifying:
   - Geographic locations.
   - Time limits for game completion.

3. **Cross-Platform Support**:
   - Web application for detailed planning and management.
   - Mobile application for on-the-go participation with QR code scanning and GPS tracking.

4. **Progress Tracking**:
   - Real-time tracking via GPS and scanned QR codes.
   - Alerts for completed tasks and remaining time.

5. **Leaderboards and History**:
   - View personal game history and statistics.
   - Compare rankings with other users.

6. **Feedback System**:
   - Send feedback messages as a user.
   - Read and manage feedback messages as an admin.

7. **Secure and Scalable**:
   - JWT-based authentication and user management.
   - Optimized backend for scalability and responsiveness.



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
- Expo (mobile)


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

### Mobile Application setup
The mobile app is built using React Native and leverages the Expo framework for cross-platform support. It introduces new features like QR code scanning and a streamlined user interface for field participation.

1. Navigate to the mobile app directory:
   ```bash
   cd mobile-argonout
    ```

2. Install dependencies:
   ```bash
   npm install
    ```

3. Start the Expo development server:
   ```bash
   npx expo start
    ```

4. Run the app on your device:
- Open the Expo Go app on your device.
- Scan the QR code displayed in the Expo developer tools.

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
| GET    | `/api/places/visited`                     | Gets all visited places.                | Paginated list of places.      |
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
| GET | `/api/users/all`                           | Gets paginated all users list (Admin only). | Status message.                |
| GET | `/api/users/{userId}`                      | Fetches the details of a specific user by user ID (Admin only).             | User details (DTO).               |
| PATCH | `/api/users/{userId}`                      | Updates the details of a specific user by user ID (Admin only).             | Success or error message.               |
| DELETE | `/api/users/{userId}`                      | Deletes a specific user account by user ID (Admin only).             | Success or error message.                |


## Technologies Used

### Backend
- Spring Boot
- Spring Security (JWT)
- Hibernate
- PostgreSQL
- JUnit and Mockito

### Frontend (web)
- React
- Bootstrap
- MaterialUI
- Axios
- CSS

### Frontend (mobile)
- React Native
- Axios
- Expo


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


## License

This project is licensed under the [Apache License](https://github.com/dminior8/argonout/blob/main/LICENSE).


## Author and Creation Date

- **Author**: Daniel Minior
- **Creation Date**: 27 July 2024
