CREATE TABLE roles (
    role_id INT PRIMARY KEY,
    role_name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE "users" (
  "user_id" UUID PRIMARY KEY,
  "username" VARCHAR(50) UNIQUE NOT NULL,
  "email" VARCHAR(100) UNIQUE NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "first_name" VARCHAR(50),
  "surname" VARCHAR(50),
  "role_id" INT NOT NULL,
  "points" INT DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "routes" (
  "route_id" UUID PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "max_time" INT,
  "is_visited" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "places" (
  "place_id" UUID PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "latitude" DECIMAL(10,8),
  "longitude" DECIMAL(11,8),
  more_info_link VARCHAR(255),
  "is_visited" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "games" (
  game_id UUID PRIMARY KEY,
  route_id UUID REFERENCES "routes" ("route_id"),
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_completed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (route_id) REFERENCES "routes" ("route_id") ON DELETE CASCADE
);

CREATE TABLE "routes_places" (
  "route_id" UUID NOT NULL,
  "place_id" UUID NOT NULL,
  PRIMARY KEY ("route_id", "place_id"),
  FOREIGN KEY ("route_id") REFERENCES "routes" ("route_id") ON DELETE CASCADE,
  FOREIGN KEY ("place_id") REFERENCES "places" ("place_id") ON DELETE CASCADE
);

CREATE TABLE "users_games" (
  "user_id" UUID NOT NULL,
  "game_id" UUID NOT NULL,
  PRIMARY KEY ("user_id", "game_id"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("user_id") ON DELETE CASCADE,
  FOREIGN KEY ("game_id") REFERENCES "games" ("game_id") ON DELETE CASCADE
);

CREATE TABLE "visited_places" (
  "visited_places_id" UUID PRIMARY KEY,
  "game_id" UUID REFERENCES "games" ("game_id"),
  "place_id" UUID REFERENCES "places" ("place_id"),
  "visited_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("game_id") REFERENCES "games" ("game_id") ON DELETE CASCADE,
  FOREIGN KEY ("place_id") REFERENCES "places" ("place_id") ON DELETE CASCADE
);
