# NovaVibe

<div align="center">

![NovaVibe logo](./Frontend/src/assets/NovaVibe_logo.png)

**A mood-aware music discovery and streaming platform**

Discover music through facial-expression-based mood detection, manage your library, and build playlists that match the moment.

[Features](#features) · [Getting Started](#getting-started) · [API Reference](#api-reference) · [Contributing](#contributing)

</div>

## Overview

NovaVibe is a full-stack music application built around personalized discovery. The frontend uses MediaPipe facial-expression analysis to identify a listener's current mood and present relevant music. Users can also browse songs, play tracks, bookmark favorites, create playlists, review recently played songs, upload music, and manage their profile.

The repository is organized as two independently runnable applications:

- `Frontend`: React + Vite single-page application
- `Backend`: Express REST API backed by MongoDB

Authentication uses HTTP-only cookies containing JWT-based sessions. ImageKit handles uploaded media, while Redis configuration is available for caching-related services.

## Features

### Music discovery

- Browse the song catalog and inspect song details.
- Filter recommendations by detected mood and genre.
- Play, pause, and continue tracks through the shared bottom player.
- Detect facial expressions in the browser with MediaPipe.

### Personal library

- Bookmark and remove favorite songs.
- Create, view, and manage playlists.
- Track recently played songs.
- View profile information and uploaded songs.

### Accounts and publishing

- Register, log in, log out, and restore sessions.
- Authenticate with Google OAuth.
- Upload songs with metadata and cloud-backed media storage.
- Protect account, dashboard, bookmark, playlist, and upload workflows.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Redux Toolkit, React Redux |
| Data fetching | Axios, TanStack React Query |
| UI | Tailwind CSS, DaisyUI, React Icons, React Hot Toast |
| Computer vision | `@mediapipe/tasks-vision` |
| Backend | Node.js, Express 5, Morgan, CORS, cookie-parser |
| Data | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs, Passport Google OAuth |
| Storage and infrastructure | ImageKit, Multer, Redis via ioredis |
| Validation and quality | express-validator, Zod, ESLint |

## Project Structure

```text
NovaVibe/
├── Backend/
│   ├── server.js                 # Database connection and HTTP server startup
│   └── src/
│       ├── app.js                # Express app, middleware, and API registration
│       ├── config/               # Database, cache, ImageKit, and environment config
│       ├── controllers/          # Request handlers
│       ├── middlewares/          # Authentication and upload middleware
│       ├── models/               # Mongoose schemas
│       ├── routes/               # REST route definitions
│       ├── services/             # Storage and external-service integrations
│       ├── utils/                # Token and shared utilities
│       └── validator/             # Request validation rules
├── Frontend/
│   ├── public/                   # Static public assets
│   └── src/
│       ├── App/                  # Router, layout, Redux store, and providers
│       ├── features/             # Feature-based pages, hooks, services, and state
│       └── assets/               # Branding and local assets
└── README.md
```

## Backend Architecture & Concepts

### Core Concepts

**Authentication & Authorization**
- Uses JWT (JSON Web Tokens) stored in HTTP-only cookies for security.
- Two-token system: Access tokens (short-lived, in-memory) and refresh tokens (long-lived, persistent).
- Middleware-based route protection validates tokens before allowing access to protected endpoints.

**Data Persistence**
- MongoDB stores all application data (users, songs, playlists, bookmarks, recently played history).
- Mongoose schemas enforce data validation and relationships.
- Blacklist model prevents token reuse after logout.

**File Upload & Media Storage**
- ImageKit handles cloud storage for uploaded audio files and metadata.
- Multer middleware processes multipart file uploads on the backend.
- Storage service abstracts ImageKit API interactions.

**Caching Strategy**
- Redis can be configured for performance optimization.
- Cache service in `config/cache.js` manages key-value storage.

**Request Validation**
- Express-validator and Zod ensure incoming data conforms to expected schemas.
- Validators in `src/validator/` check authentication, song metadata, playlist details, etc.

### Backend Directory Deep Dive

| Directory | Purpose |
| --- | --- |
| `src/app.js` | Express app initialization, middleware setup (CORS, cookies, body parser), route registration, error handling |
| `src/config/` | Environment loading, MongoDB connection, Redis/cache setup, ImageKit initialization, database config |
| `src/controllers/` | Route handlers that process requests, validate input, call services, and return responses |
| `src/middlewares/` | Auth middleware validates JWT tokens; upload middleware handles file processing and validation |
| `src/models/` | Mongoose schemas defining data structure for users, songs, playlists, bookmarks, history, and blacklisted tokens |
| `src/routes/` | Express route definitions; link HTTP methods and paths to controller functions |
| `src/services/` | Business logic abstraction; storage service interfaces with ImageKit for uploads/deletions |
| `src/utils/` | Token utilities for JWT creation, validation, and expiration handling |
| `src/validator/` | Request validation schemas using express-validator; checks authentication, song metadata, etc. |
| `server.js` | Entry point; starts MongoDB connection and HTTP server |

## Frontend Architecture & Components

### Core Concepts

**State Management**
- Redux Toolkit manages global app state (user auth, player, bookmarks, playlists).
- Redux slices organize state by feature domain.

**Data Fetching**
- Axios client pre-configured with base URL pointing to `/api`.
- TanStack React Query handles caching, synchronization, and server state.
- API service files abstract HTTP requests for each feature.

**UI & Styling**
- Tailwind CSS provides utility-first styling.
- DaisyUI offers pre-built component themes.
- React Icons for consistent iconography.

**Computer Vision**
- MediaPipe analyzes facial landmarks captured from user's camera.
- Face expression detection runs in-browser for privacy.
- Mood labels inform music recommendations.

**Routing**
- React Router enables client-side navigation between pages.
- Protected routes ensure unauthenticated users cannot access private pages.

### Frontend Directory Deep Dive

| Directory | Purpose |
| --- | --- |
| `src/App/` | Application root; exports router config, Redux store, layout wrapper, and global CSS |
| `src/App/app.routes.jsx` | React Router route definitions; links paths to page components and applies layout |
| `src/App/app.store.js` | Redux store setup combining all feature slices |
| `src/App/AppLayout.jsx` | Wraps all pages with header, navigation, and bottom player |
| `src/features/` | Feature-based organization; each feature contains pages, components, hooks, services, and state |
| `src/features/auth/` | Login, register, Google OAuth, profile; authentication state and API integration |
| `src/features/bookmarks/` | Bookmark management; useBookmarks hook for adding/removing favorites |
| `src/features/dashboard/` | User dashboard and song upload interface |
| `src/features/faceDetectExpression/` | MediaPipe integration for mood detection from camera feed |
| `src/features/player/` | Bottom player component; playback controls and current track display |
| `src/features/playlists/` | Create, edit, delete, view playlists; playlist state and CRUD operations |
| `src/features/songs/` | Browse songs; song filtering, search, and display |
| `src/features/recentlyPlayed/` | Track and display user's listening history |
| `src/features/Shared/` | Shared components and API utilities used across features |
| `src/assets/` | Logos, images, and static branding files |

## Getting Started

### Prerequisites

Install or create the following before starting the project:

- **Node.js 18+** and **npm** (verify with `node --version` and `npm --version`)
- **MongoDB** (local via Docker/Homebrew or hosted via MongoDB Atlas)
- **ImageKit account** (free tier available at imagekit.io for media uploads)
- **Google OAuth credentials** (create at https://console.cloud.google.com)
- **Redis** (optional, for caching; local via Docker or hosted service)
- **Git** for cloning the repository

### 1. Clone the repository

```bash
git clone https://github.com/NasimReja077/novavibe.git
cd novavibe
```

### 2. Configure the backend

#### 2a. Set up MongoDB

**Option 1: Local MongoDB**
```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Verify it's running
mongo --eval "db.adminCommand('ping')"
```

**Option 2: Docker**
```bash
docker run -d -p 27017:27017 --name novavibe-mongo mongo:latest
```

**Option 3: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get the connection URI: `mongodb+srv://username:password@cluster.mongodb.net/novavibe`

#### 2b. Set up ImageKit

1. Sign up at https://imagekit.io (free tier available)
2. Navigate to Settings → API Keys
3. Copy your private key (keep it secret)

#### 2c. Set up Google OAuth

1. Go to https://console.cloud.google.com
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - Your production URL when deploying
6. Copy Client ID and Client Secret

#### 2d. Create Backend `.env` file

Create `Backend/.env` with all required variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/novavibe
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/novavibe

# JWT Secrets (generate strong random strings)
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars_long

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ImageKit
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

# Redis (optional, for caching)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

**Security Note:** Never commit `.env` files to version control. The backend validates all required variables during startup and exits with a clear error if any are missing.

#### 2e. Install and start backend

```bash
cd Backend
npm install
npm run dev
```

Expected console output:
```
Connected to MongoDB
Server is running on port 3000
```

Verify the API is responding:
```bash
curl http://localhost:3000/
```

Expected response:
```json
{ "message": "Server is Running" }
```

### 3. Configure and start the frontend

#### 3a. Create Frontend `.env` file

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

The frontend uses Axios to communicate with the backend API. All requests are prefixed with this base URL.

#### 3b. Install and start frontend

```bash
cd Frontend
npm install
npm run dev
```

Expected console output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

Open `http://localhost:5173` in your browser.

#### 3c. CORS Configuration

The backend's CORS policy currently allows requests from `http://localhost:5173`. Update `Backend/src/app.js` if using a different frontend URL:

```javascript
const corsOptions = {
  origin: 'http://localhost:5173', // or your production domain
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
};
```

Restart the backend after changing CORS settings.

## API Reference

All API endpoints are prefixed with `/api`. Protected endpoints require a valid authenticated session cookie.

### Authentication Flow

The application uses JWT tokens stored in HTTP-only cookies:

1. User registers or logs in with credentials (or Google OAuth)
2. Backend issues `accessToken` (short-lived, in-memory) and `refreshToken` (long-lived, persistent) cookies
3. Browser automatically includes cookies with each request
4. Protected routes check the access token; if expired, refresh token is used to obtain a new access token
5. On logout, token is blacklisted to prevent reuse

### Health Check

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Confirm that the backend is running |

**Example:**
```bash
curl http://localhost:3000/
```

Response:
```json
{ "message": "Server is Running" }
```

### Authentication Endpoints

#### Register
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Create a new user account |

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | No | Start an email/password session |

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Sets cookies: `accessToken` and `refreshToken`

#### Get Current User
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/auth/me` | Yes | Return the current authenticated user |

**Request:**
```bash
curl http://localhost:3000/api/auth/me \
  -b cookies.txt
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "uploadedSongs": [],
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Logout
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/logout` | Yes | End the current session and blacklist token |

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

**Response (200):**
```json
{ "message": "Logout successful" }
```

#### Refresh Token
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/refresh` | No | Refresh an expired access token |

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -b cookies.txt
```

**Response (200):**
```json
{ "message": "Token refreshed successfully" }
```

#### Google OAuth (Initiate)
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/auth/google` | No | Redirect to Google login |

**Request:**
```bash
curl -L http://localhost:3000/api/auth/google
```

Redirects to Google's OAuth consent screen.

#### Google OAuth (Callback)
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/auth/google/callback` | No | Complete Google OAuth and set session cookies |

Called automatically by Google after user consents. Frontend will receive authentication cookies.

### Songs Endpoints

#### List Songs
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/songs` | No | List all songs with optional filtering |

**Query Parameters:**
- `genre` (string): Filter by genre (e.g., `?genre=rock`)
- `mood` (string): Filter by mood (e.g., `?mood=happy`)
- `search` (string): Search by title or artist (e.g., `?search=john`)
- `limit` (number): Maximum results (default: 50)
- `skip` (number): Pagination offset (default: 0)

**Request:**
```bash
curl "http://localhost:3000/api/songs?genre=rock&limit=20"
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "Example Song",
    "artist": "Artist Name",
    "genre": "rock",
    "duration": 240,
    "mood": "energetic",
    "fileURL": "https://ik.imagekit.io/...",
    "uploadedBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Single Song
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/songs/:id` | No | Retrieve detailed information about a specific song |

**Request:**
```bash
curl http://localhost:3000/api/songs/507f1f77bcf86cd799439012
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Example Song",
  "artist": "Artist Name",
  "genre": "rock",
  "duration": 240,
  "mood": "energetic",
  "fileURL": "https://ik.imagekit.io/...",
  "uploadedBy": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Artist Name"
  },
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Get User's Songs
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/songs/user/:userId` | Yes | Retrieve all songs uploaded by a specific user |

**Request:**
```bash
curl http://localhost:3000/api/songs/user/507f1f77bcf86cd799439011 \
  -b cookies.txt
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "title": "My Song",
    "artist": "Me",
    "genre": "pop",
    "duration": 180,
    "mood": "happy",
    "fileURL": "https://ik.imagekit.io/...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Upload Song
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/songs` | Yes | Upload a song file with metadata |

**Request (multipart/form-data):**
```bash
curl -X POST http://localhost:3000/api/songs \
  -b cookies.txt \
  -F "file=@song.mp3" \
  -F "title=My New Song" \
  -F "artist=My Name" \
  -F "genre=pop" \
  -F "duration=180" \
  -F "mood=happy"
```

**Response (201):**
```json
{
  "message": "Song uploaded successfully",
  "song": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "My New Song",
    "artist": "My Name",
    "genre": "pop",
    "duration": 180,
    "mood": "happy",
    "fileURL": "https://ik.imagekit.io/..."
  }
}
```

#### Delete Song
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `DELETE` | `/api/songs/:id` | Yes | Delete an owned song |

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/songs/507f1f77bcf86cd799439012 \
  -b cookies.txt
```

**Response (200):**
```json
{ "message": "Song deleted successfully" }
```

### Playlists Endpoints

#### List Playlists
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/playlists` | Yes | Get all playlists for the current user |

**Request:**
```bash
curl http://localhost:3000/api/playlists \
  -b cookies.txt
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "My Favorites",
    "description": "Songs I love",
    "songs": ["507f1f77bcf86cd799439012"],
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Playlist Details
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/playlists/:id` | Yes | Get detailed information about a playlist including all songs |

**Request:**
```bash
curl http://localhost:3000/api/playlists/507f1f77bcf86cd799439013 \
  -b cookies.txt
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "My Favorites",
  "description": "Songs I love",
  "songs": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Example Song",
      "artist": "Artist Name",
      "genre": "rock"
    }
  ],
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### Create Playlist
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/playlists` | Yes | Create a new playlist |

**Request:**
```bash
curl -X POST http://localhost:3000/api/playlists \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "My Workout Mix",
    "description": "High energy songs for the gym"
  }'
```

**Response (201):**
```json
{
  "message": "Playlist created successfully",
  "playlist": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "My Workout Mix",
    "description": "High energy songs for the gym",
    "songs": [],
    "createdBy": "507f1f77bcf86cd799439011"
  }
}
```

#### Update Playlist
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `PUT` | `/api/playlists/:id` | Yes | Update playlist name, description, or add/remove songs |

**Request (add song):**
```bash
curl -X PUT http://localhost:3000/api/playlists/507f1f77bcf86cd799439013 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "My Workout Mix",
    "songs": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439014"]
  }'
```

**Response (200):**
```json
{
  "message": "Playlist updated successfully",
  "playlist": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "My Workout Mix",
    "songs": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439014"]
  }
}
```

#### Delete Playlist
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `DELETE` | `/api/playlists/:id` | Yes | Delete a playlist |

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/playlists/507f1f77bcf86cd799439013 \
  -b cookies.txt
```

**Response (200):**
```json
{ "message": "Playlist deleted successfully" }
```

### Bookmarks Endpoints

#### List Bookmarks
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/bookmarks` | Yes | Get all bookmarked songs for the current user |

**Request:**
```bash
curl http://localhost:3000/api/bookmarks \
  -b cookies.txt
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "songId": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Example Song",
      "artist": "Artist Name"
    },
    "userId": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Add Bookmark
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/bookmarks` | Yes | Bookmark a song |

**Request:**
```bash
curl -X POST http://localhost:3000/api/bookmarks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "songId": "507f1f77bcf86cd799439012"
  }'
```

**Response (201):**
```json
{
  "message": "Song bookmarked successfully",
  "bookmark": {
    "_id": "507f1f77bcf86cd799439015",
    "songId": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

#### Remove Bookmark
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `DELETE` | `/api/bookmarks/:songId` | Yes | Remove a song bookmark |

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/bookmarks/507f1f77bcf86cd799439012 \
  -b cookies.txt
```

**Response (200):**
```json
{ "message": "Bookmark removed successfully" }
```

### Recently Played Endpoints

#### List Recently Played
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/recently-played` | Yes | Get the user's listening history |

**Query Parameters:**
- `limit` (number): Maximum results (default: 50)
- `skip` (number): Pagination offset (default: 0)

**Request:**
```bash
curl "http://localhost:3000/api/recently-played?limit=20" \
  -b cookies.txt
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439016",
    "songId": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Example Song",
      "artist": "Artist Name"
    },
    "userId": "507f1f77bcf86cd799439011",
    "playedAt": "2024-01-15T14:30:00Z"
  }
]
```

#### Record Recently Played
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/recently-played` | Yes | Log that a song was played |

**Request:**
```bash
curl -X POST http://localhost:3000/api/recently-played \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "songId": "507f1f77bcf86cd799439012"
  }'
```

**Response (201):**
```json
{
  "message": "Song added to recently played",
  "record": {
    "_id": "507f1f77bcf86cd799439016",
    "songId": "507f1f77bcf86cd799439012",
    "playedAt": "2024-01-15T14:30:00Z"
  }
}
```

#### Clear History
| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `DELETE` | `/api/recently-played/clear` | Yes | Clear all recently played history |

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/recently-played/clear \
  -b cookies.txt
```

**Response (200):**
```json
{ "message": "History cleared successfully" }
```

## Usage Examples

### Workflow 1: User Registration and First Login

```bash
# 1. Register a new account
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "securepass123"
  }'

# 2. Login (if you don't auto-login after register)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -c cookies.txt \
  -d '{
    "email": "alice@example.com",
    "password": "securepass123"
  }'

# 3. Fetch current user to confirm login
curl http://localhost:3000/api/auth/me \
  -b cookies.txt
```

### Workflow 2: Browse Songs and Create a Playlist

```bash
# 1. Browse all songs
curl "http://localhost:3000/api/songs?genre=pop&limit=10"

# 2. Search for specific songs
curl "http://localhost:3000/api/songs?search=jazz"

# 3. Get details of a specific song
curl http://localhost:3000/api/songs/507f1f77bcf86cd799439012

# 4. Create a playlist
curl -X POST http://localhost:3000/api/playlists \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Chill Vibes",
    "description": "Relaxing songs for studying"
  }'

# 5. Add songs to the playlist (using playlist ID from step 4)
curl -X PUT http://localhost:3000/api/playlists/507f1f77bcf86cd799439013 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Chill Vibes",
    "songs": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439014"]
  }'
```

### Workflow 3: Bookmark Favorite Songs and Track History

```bash
# 1. Bookmark a song
curl -X POST http://localhost:3000/api/bookmarks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "songId": "507f1f77bcf86cd799439012"
  }'

# 2. View all bookmarks
curl http://localhost:3000/api/bookmarks \
  -b cookies.txt

# 3. Log that a song was played
curl -X POST http://localhost:3000/api/recently-played \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "songId": "507f1f77bcf86cd799439012"
  }'

# 4. View recently played history
curl "http://localhost:3000/api/recently-played?limit=20" \
  -b cookies.txt

# 5. Remove a bookmark
curl -X DELETE http://localhost:3000/api/bookmarks/507f1f77bcf86cd799439012 \
  -b cookies.txt
```

### Workflow 4: Upload a Song (Artist)

```bash
# 1. Upload a song file with metadata
curl -X POST http://localhost:3000/api/songs \
  -b cookies.txt \
  -F "file=@my-song.mp3" \
  -F "title=My Debut Song" \
  -F "artist=My Band" \
  -F "genre=indie" \
  -F "duration=240" \
  -F "mood=melancholic"

# 2. View your uploaded songs
curl http://localhost:3000/api/songs/user/507f1f77bcf86cd799439011 \
  -b cookies.txt

# 3. Delete an uploaded song
curl -X DELETE http://localhost:3000/api/songs/507f1f77bcf86cd799439012 \
  -b cookies.txt
```

### Frontend Usage: Mood Detection and Recommendations

From the React frontend:

```javascript
// 1. Authenticate user (Login.jsx)
// User enters email/password → calls /api/auth/login

// 2. Enable camera for mood detection (FaceExpression.jsx)
// User grants camera permission
// MediaPipe analyzes facial landmarks in real-time
// Mood label is sent to store

// 3. Filter songs by detected mood
// Frontend queries /api/songs?mood=happy
// Results populate the recommendation feed

// 4. Play a song
// User clicks play on a song
// BottomPlayer component shows playback controls
// Frontend logs play to /api/recently-played

// 5. Bookmark and create playlists
// User interacts with bookmark buttons → calls /api/bookmarks
// User creates playlist → calls /api/playlists POST/PUT
```

## Application Flow

### Detailed User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User Opens Application                                       │
│    └─ Frontend loads React app                                  │
│       └─ Calls GET /api/auth/me to restore session              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. Authentication                                               │
│    └─ If not authenticated:                                     │
│       ├─ User can register: POST /api/auth/register             │
│       ├─ User can login: POST /api/auth/login                   │
│       └─ User can use Google OAuth: GET /api/auth/google        │
│    └─ Session stored in HTTP-only cookies                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. Browse Music Catalog                                         │
│    └─ Frontend loads public songs: GET /api/songs               │
│       ├─ Optional filters: genre, mood, search                  │
│       └─ Display song list in browse/search UI                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Mood Detection (Optional)                                    │
│    └─ User enables camera in browser                            │
│       ├─ MediaPipe analyzes facial landmarks in real-time       │
│       ├─ Detects mood label (e.g., happy, sad, neutral)         │
│       └─ Frontend refines recommendations by mood               │
│          └─ Queries GET /api/songs?mood=happy                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. Interact with Music                                          │
│    ├─ Play/Pause Songs                                          │
│    │  └─ Log playback: POST /api/recently-played                │
│    │                                                             │
│    ├─ Bookmark Favorites                                        │
│    │  ├─ Add: POST /api/bookmarks                               │
│    │  ├─ View: GET /api/bookmarks                               │
│    │  └─ Remove: DELETE /api/bookmarks/:songId                  │
│    │                                                             │
│    ├─ Create Playlists                                          │
│    │  ├─ Create: POST /api/playlists                            │
│    │  ├─ Add songs: PUT /api/playlists/:id                      │
│    │  └─ View: GET /api/playlists/:id                           │
│    │                                                             │
│    └─ Track History                                             │
│       ├─ View: GET /api/recently-played                         │
│       └─ Clear: DELETE /api/recently-played/clear               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. Upload Music (If Artist)                                     │
│    └─ User uploads song: POST /api/songs (multipart)            │
│       ├─ Multer processes file upload                           │
│       ├─ Metadata stored in MongoDB                             │
│       ├─ Audio file uploaded to ImageKit                        │
│       └─ Song becomes available in catalog                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. Manage Profile                                               │
│    └─ View profile: GET /api/auth/me                            │
│       ├─ View uploaded songs: GET /api/songs/user/:userId       │
│       ├─ Delete song: DELETE /api/songs/:id                     │
│       └─ Logout: POST /api/auth/logout                          │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

**Frontend → Backend:**
1. React components dispatch Redux actions
2. Axios intercepts requests and adds authentication cookies
3. Request sent to `/api` endpoint with credentials
4. Backend middleware validates JWT token

**Backend Processing:**
1. Route handler receives request
2. Auth middleware validates token (if protected route)
3. Express-validator checks request data
4. Controller processes business logic
5. Service layer handles external APIs (ImageKit, Redis)
6. Mongoose writes/reads from MongoDB
7. Response sent back to frontend with appropriate HTTP status

**Backend → Frontend:**
1. Backend returns JSON response
2. Axios interceptor handles response
3. Redux store updates with new data
4. React components re-render with latest state

## Available Scripts

### Backend

Run these commands from `Backend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon for auto-reloading |
| `npm test` | Placeholder test command; automated backend tests are not configured yet |

**Typical development workflow:**
```bash
cd Backend
npm run dev
# Backend restarts automatically on file changes
```

### Frontend

Run these commands from `Frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with HMR (Hot Module Replacement) |
| `npm run build` | Create an optimized production build (outputs to `dist/`) |
| `npm run preview` | Serve the production build locally for testing |
| `npm run lint` | Run ESLint to check for code quality issues |

**Typical development workflow:**
```bash
cd Frontend
npm run dev
# Vite opens browser at http://localhost:5173
# Changes to source files trigger HMR updates automatically
```

## Troubleshooting

### The backend exits during startup

**Problem:** Backend crashes immediately with error messages about configuration.

**Solutions:**
- Verify `Backend/.env` contains ALL required variables (check `src/config/config.js` for the full list)
- Check MongoDB is running and the `MONGODB_URI` is correct:
  ```bash
  # Test MongoDB locally
  mongosh --uri "mongodb://127.0.0.1:27017/novavibe"
  ```
- Ensure JWT_SECRET and JWT_REFRESH_SECRET are long random strings (minimum 32 characters recommended)
- If using MongoDB Atlas, verify the connection string matches the database name and credentials
- Check Node.js version is 18+:
  ```bash
  node --version
  ```

### The frontend cannot reach the API

**Problem:** Frontend displays network errors or "Connection refused".

**Solutions:**
- Verify backend is running on port 3000:
  ```bash
  curl http://localhost:3000/
  ```
- Check `Frontend/.env` has the correct API URL:
  ```env
  VITE_API_URL=http://localhost:3000/api
  ```
- Restart Vite after changing `.env`:
  ```bash
  npm run dev
  ```
- Check browser console (F12 → Console tab) for detailed error messages
- Verify CORS settings in `Backend/src/app.js` allow `http://localhost:5173`:
  ```javascript
  const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
  };
  ```

### Requests return `401 Unauthorized`

**Problem:** API calls fail with 401 even after logging in.

**Solutions:**
- Verify browser is accepting cookies:
  - Open DevTools (F12) → Application tab → Cookies
  - Look for `accessToken` and `refreshToken` cookies from `localhost:3000`
  - If missing, check backend is setting them correctly
- Ensure Axios is configured to send credentials:
  - Check `Frontend/src/features/Shared/services/` for Axios instance
  - Should have `withCredentials: true`
- Session may have expired; try logging in again
- Check backend's `JWT_SECRET` matches the token used during login
- Clear browser cookies and try again:
  - DevTools → Application → Cookies → right-click and clear

### Requests return `403 Forbidden`

**Problem:** Authenticated user cannot access a protected resource.

**Solutions:**
- Verify the endpoint is protected and requires authentication
- Check user has permission (e.g., only song uploader can delete a song)
- Ensure the request includes valid authentication cookies
- Review error message from server for specific permission details

### Google sign-in fails

**Problem:** "Error 403: access_denied" or OAuth screen doesn't appear.

**Solutions:**
- Verify Google OAuth credentials in `Backend/.env`:
  ```env
  GOOGLE_CLIENT_ID=your_actual_client_id.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=your_actual_secret
  ```
- Add the callback URL to Google Cloud Console:
  - Go to https://console.cloud.google.com
  - Select your project → Credentials
  - Click the OAuth 2.0 Client ID
  - Add authorized redirect URIs:
    - `http://localhost:3000/api/auth/google/callback` (development)
  - Save changes
- Restart backend to load new credentials
- Clear browser cookies and try again
- Check frontend is linking to the correct endpoint:
  - Should be `/api/auth/google`, not a hardcoded Google URL

### Camera/face detection does not start

**Problem:** MediaPipe camera feature is not working or shows "Camera access denied".

**Solutions:**
- Check browser is allowing camera access:
  - Click the camera icon in the address bar (Chrome/Edge)
  - Select "Allow" for `localhost:5173`
- Ensure using a secure context (localhost or HTTPS):
  - MediaPipe requires secure contexts for camera access
  - `http://127.0.0.1:5173` is considered secure
  - `http://myip:5173` is NOT secure and will fail
- Check browser console for MediaPipe errors:
  - Open DevTools (F12) → Console tab
  - Look for errors from `@mediapipe/tasks-vision`
- Verify MediaPipe assets load correctly:
  - DevTools → Network tab
  - Search for `.wasm` files
  - If they're 404, check `Frontend/public/` has MediaPipe assets
- Try disabling browser extensions that might block camera
- Test in a different browser to isolate issues

### File upload fails

**Problem:** Song upload returns error or file doesn't appear after upload.

**Solutions:**
- Verify ImageKit credentials in `Backend/.env`:
  ```env
  IMAGEKIT_PRIVATE_KEY=your_actual_imagekit_private_key
  ```
- Check file size is within limits (backend has validation)
- Ensure file is a supported format (typically `.mp3`, `.wav`, `.m4a`)
- Verify all required fields are provided:
  ```bash
  curl -X POST http://localhost:3000/api/songs \
    -b cookies.txt \
    -F "file=@song.mp3" \
    -F "title=Song Title" \
    -F "artist=Artist Name" \
    -F "genre=pop" \
    -F "duration=180" \
    -F "mood=happy"
  ```
- Check backend logs for specific upload errors
- Verify user is authenticated (has valid session)

### Playlists or bookmarks are not saving

**Problem:** Creating bookmarks/playlists appears to succeed but data doesn't persist.

**Solutions:**
- Verify MongoDB is running and contains data:
  ```bash
  mongosh --uri "mongodb://127.0.0.1:27017/novavibe"
  # In mongosh:
  > db.bookmarks.find()
  > db.playlists.find()
  ```
- Check user is authenticated:
  - GET `/api/auth/me` should return current user
- Verify request payload is correct:
  ```bash
  curl -X POST http://localhost:3000/api/bookmarks \
    -H "Content-Type: application/json" \
    -b cookies.txt \
    -d '{"songId":"507f1f77bcf86cd799439012"}'
  ```
- Check backend logs for database errors
- Ensure `MONGODB_URI` in `.env` points to correct database

### Redis/caching is not working

**Problem:** Cache service errors or cache doesn't seem to improve performance.

**Solutions:**
- Redis is optional; if not needed, disable in `Backend/src/app.js`
- If using Redis, verify it's running:
  ```bash
  # Test Redis locally
  redis-cli ping
  # Should respond: PONG
  ```
- Check Redis credentials in `Backend/.env`:
  ```env
  REDIS_HOST=127.0.0.1
  REDIS_PORT=6379
  REDIS_PASSWORD=
  ```
- If using Docker:
  ```bash
  docker run -d -p 6379:6379 --name novavibe-redis redis:latest
  ```
- Restart backend after changing Redis config

### Port already in use

**Problem:** "Error: listen EADDRINUSE :::3000" or similar.

**Solutions:**
- Find what's using the port:
  ```bash
  # macOS/Linux
  lsof -i :3000
  
  # Windows
  netstat -ano | findstr :3000
  ```
- Either kill the existing process or change the PORT in `.env`:
  ```env
  PORT=3001
  ```
  (then update `Frontend/.env` to use the new port)

## Security Notes

- Keep all secrets in environment files outside version control.
- Use strong, unique JWT secrets in deployed environments.
- Restrict CORS to the real frontend origin in production.
- Use HTTPS in production so authentication cookies are protected in transit.
- Validate upload size, file type, and ownership before accepting or deleting media.

## Contributing

1. Fork the repository.
2. Create a focused branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Install dependencies in both `Backend/` and `Frontend/`.
4. Make the smallest focused change that solves the issue.
5. Run `npm run lint` and `npm run build` from `Frontend/`.
6. Commit with a clear message and open a pull request.

Please include reproduction steps for bug fixes and screenshots or short recordings for user-interface changes.

## Roadmap Ideas

- Add automated backend and frontend tests.
- Add pagination and server-side filtering for large song libraries.
- Add richer mood history and recommendation feedback.
- Add production deployment configuration and observability.
- Improve upload progress, media validation, and accessibility coverage.

## License and Author

This project currently declares the ISC license in `Backend/package.json`.

Created by [Nasim Reja](https://github.com/NasimReja077).

<div align="center">

**Feel the music. Live the vibe.**

</div>
