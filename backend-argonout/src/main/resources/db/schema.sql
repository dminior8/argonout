CREATE TABLE "users" (
  "user_id" UUID PRIMARY KEY,
  "username" VARCHAR(50) UNIQUE NOT NULL,
  "email" VARCHAR(100) UNIQUE NOT NULL,
  "password_hash" VARCHAR(255) NOT NULL,
  "first_name" VARCHAR(50),
  "last_name" VARCHAR(50),
  "role" VARCHAR(10) NOT NULL CHECK (role IN ('USER', 'ADMIN')),
  "points" INT DEFAULT 0
);

CREATE TABLE "routes" (
  "route_id" UUID PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "max_time" INT
);

CREATE TABLE "places" (
  "place_id" UUID PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "latitude" DECIMAL(10,8),
  "longitude" DECIMAL(11,8)
);

CREATE TABLE "achievements" (
  "achievement_id" UUID PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT
);

CREATE TABLE "posts" (
  "post_id" UUID PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "users" ("user_id")
);

CREATE TABLE "threads" (
  "thread_id" UUID PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "created_by" UUID NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("created_by") REFERENCES "users" ("user_id")
);

CREATE TABLE "leagues" (
  "league_id" UUID PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "color" VARCHAR(10) NOT NULL
);

CREATE TABLE "notifications" (
  "notification_id" UUID PRIMARY KEY,
  "user_id" UUID NOT NULL,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "read_at" TIMESTAMP,
  FOREIGN KEY ("user_id") REFERENCES "users" ("user_id")
);

CREATE TABLE "users_achievements" (
  "user_id" UUID NOT NULL,
  "achievement_id" UUID NOT NULL,
  "progress" DOUBLE PRECISION,
  "achieved_at" TIMESTAMP,
  PRIMARY KEY ("user_id", "achievement_id"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("user_id"),
  FOREIGN KEY ("achievement_id") REFERENCES "achievements" ("achievement_id")
);

CREATE TABLE "users_routes" (
  "user_id" UUID NOT NULL,
  "route_id" UUID NOT NULL,
  "visited_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_id", "route_id"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("user_id"),
  FOREIGN KEY ("route_id") REFERENCES "routes" ("route_id")
);

CREATE TABLE "routes_places" (
  "route_id" UUID NOT NULL,
  "place_id" UUID NOT NULL,
  PRIMARY KEY ("route_id", "place_id"),
  FOREIGN KEY ("route_id") REFERENCES "routes" ("route_id"),
  FOREIGN KEY ("place_id") REFERENCES "places" ("place_id")
);

CREATE TABLE "posts_threads" (
  "post_id" UUID NOT NULL,
  "thread_id" UUID NOT NULL,
  PRIMARY KEY ("post_id", "thread_id"),
  FOREIGN KEY ("post_id") REFERENCES "posts" ("post_id"),
  FOREIGN KEY ("thread_id") REFERENCES "threads" ("thread_id")
);

CREATE TABLE "points_of_users" (
  "user_id" UUID NOT NULL,
  "points" INT NOT NULL DEFAULT 0,
  "period" DATE NOT NULL,
  PRIMARY KEY ("user_id", "period"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("user_id")
);

CREATE TABLE "leagues_of_users" (
  "user_id" UUID NOT NULL,
  "league_id" UUID NOT NULL,
  "assigned_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_id", "league_id"),
  FOREIGN KEY ("user_id") REFERENCES "users" ("user_id"),
  FOREIGN KEY ("league_id") REFERENCES "leagues" ("league_id")
);
