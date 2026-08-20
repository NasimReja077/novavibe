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

## Getting Started

### Prerequisites

Install or create the following before starting the project:

- Node.js 18 or newer
- npm
- A MongoDB database, local or hosted
- An ImageKit account for song uploads
- Google OAuth credentials for Google sign-in
- Redis, if the cache service is enabled in your environment

### 1. Clone the repository

```bash
git clone https://github.com/NasimReja077/novavibe.git
cd novavibe
```

### 2. Configure the backend

Create `Backend/.env`:

```env
PORT=3000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/novavibe
JWT_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_a_second_long_random_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
```

The backend validates `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `IMAGEKIT_PRIVATE_KEY` during startup. Do not commit `.env` files or real credentials.

Install dependencies and start the API:

```bash
cd Backend
npm install
npm run dev
```

The API listens on `http://localhost:3000` by default. Verify it is running:

```bash
curl http://localhost:3000/
```

Expected response:

```json
{ "message": "Server is Running" }
```

### 3. Configure and start the frontend

The Axios client expects the API base URL to include `/api`. Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Then install dependencies and run Vite:

```bash
cd Frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

The backend currently allows browser requests from `http://localhost:5173` and uses credentials for cookie-based authentication. Update the CORS origin in `Backend/src/app.js` when using another frontend origin.

## Available Scripts

### Backend

Run these commands from `Backend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm test` | Placeholder test command; automated backend tests are not configured yet |

### Frontend

Run these commands from `Frontend/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## API Reference

All API endpoints are prefixed with `/api`. Protected endpoints require a valid authenticated session cookie.

### Health check

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Confirm that the backend is running |

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Start an email/password session |
| `POST` | `/api/auth/logout` | End the current session |
| `GET` | `/api/auth/me` | Return the current user |
| `POST` | `/api/auth/refresh` | Refresh an expired access token |
| `GET` | `/api/auth/google` | Start Google OAuth |
| `GET` | `/api/auth/google/callback` | Complete Google OAuth |

### Songs

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/songs` | No | List songs, optionally with query parameters |
| `GET` | `/api/songs/:id` | No | Get one song |
| `GET` | `/api/songs/user/:userId` | Yes | Get songs uploaded by a user |
| `POST` | `/api/songs` | Yes | Upload a song and its metadata |
| `DELETE` | `/api/songs/:id` | Yes | Delete an owned song |

### Playlists, bookmarks, and history

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/playlists` | Yes | List the current user's playlists |
| `GET` | `/api/playlists/:id` | Yes | Get playlist details |
| `POST` | `/api/playlists` | Yes | Create a playlist |
| `PUT` | `/api/playlists/:id` | Yes | Update a playlist |
| `DELETE` | `/api/playlists/:id` | Yes | Delete a playlist |
| `GET` | `/api/bookmarks` | Yes | List bookmarked songs |
| `POST` | `/api/bookmarks` | Yes | Bookmark a song |
| `DELETE` | `/api/bookmarks/:songId` | Yes | Remove a song bookmark |
| `GET` | `/api/recently-played` | Yes | List recently played songs |
| `POST` | `/api/recently-played` | Yes | Record a played song |
| `DELETE` | `/api/recently-played/clear` | Yes | Clear listening history |

## Application Flow

1. The user opens the React application and the frontend restores the session through `/api/auth/me`.
2. Public catalog data is loaded from the songs and playlists endpoints.
3. When the camera feature is enabled, MediaPipe analyzes facial landmarks and produces a mood label in the browser.
4. The frontend uses that mood to filter or prioritize music discovery.
5. Playing a song can update recently played history for authenticated users.
6. Bookmarks and playlists are persisted through protected API endpoints.
7. Uploaded audio and related media are sent through the backend storage flow and saved using ImageKit.

## Troubleshooting

### The backend exits during startup

Check that `Backend/.env` contains every required variable and that MongoDB is reachable. The configuration module intentionally fails fast when required credentials are missing.

### The frontend cannot reach the API

Confirm that the backend is running on port `3000` and that `Frontend/.env` contains:

```env
VITE_API_URL=http://localhost:3000/api
```

Restart Vite after changing environment variables.

### Requests return `401`

Make sure the browser is accepting cookies, the frontend Axios client is using credentials, and the backend CORS origin matches the frontend URL. Try signing in again if the access and refresh cookies have expired.

### Google sign-in fails

The Google OAuth callback is configured for:

```text
http://localhost:3000/api/auth/google/callback
```

Add that exact callback URL to the Google Cloud OAuth client and verify the client ID and secret in `Backend/.env`.

### Camera detection does not start

Allow camera access in the browser and use a secure context such as `localhost` or HTTPS. MediaPipe assets also need to be available to the browser without being blocked by network or content-security settings.

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
