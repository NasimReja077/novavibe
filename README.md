# 🎵 NovaVibe – Mood-Based Music Streaming Platform

<div align="center">

![NovaVibe](./Frontend/src/assets/NovaVibe_logo.png)

**NovaVibe** - A mood-based music streaming platform that uses facial expression detection to curate personalized songs and playlists.

</div>

---

## 📖 Overview

NovaVibe is an innovative web application that analyzes users' **facial expressions in real-time** to detect their current mood and recommends music accordingly. Built with a modern tech stack, it features user authentication, music upload capabilities, and a responsive UI. The platform leverages **MediaPipe** for facial expression recognition, ensuring a personalized music experience based on emotional state.

This AI-powered full-stack application combines **computer vision** with a **MERN stack architecture** to create an interactive and immersive music discovery experience like never before.

---

## ✨ Key Features

- **🎭 Real-Time Facial Expression Detection** - Uses MediaPipe to detect user emotions (Happy, Sad, Angry, Neutral, Surprised, etc.)
- **🎼 Mood-Based Music Recommendations** - Automatically suggests songs and playlists matching your current mood
- **🔐 Secure Authentication** - User registration, login, and Google OAuth integration
- **🎵 Music Upload & Management** - Upload your own music with ImageKit integration for storage
- **❤️ Bookmarking System** - Save your favorite songs and playlists for quick access
- **📝 Playlist Creation** - Create custom playlists and organize music by mood
- **⏱️ Recently Played Tracking** - Keep track of your music listening history
- **👤 User Profiles** - Personalized user experience with profile management
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js** - UI library with component-based architecture
- **Redux Toolkit** - State management
- **Vite** - Lightning-fast build tool
- **MediaPipe** - Facial expression detection library
- **TailwindCSS / CSS** - Styling

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - REST API framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **ImageKit** - Cloud image/media storage service

### **DevTools**
- **ESLint** - Code quality
- **Vite** - Fast build and dev server

---

## 📂 Project Structure

```
NovaVibe/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cache.js
│   │   │   ├── config.js
│   │   │   ├── database.js
│   │   │   └── imagekit.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── bookmark.controller.js
│   │   │   ├── playlist.controller.js
│   │   │   ├── recentlyPlayedSong.controller.js
│   │   │   └── song.controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── song.model.js
│   │   │   ├── playlist.model.js
│   │   │   ├── bookmark.model.js
│   │   │   ├── recentlyPlayedSong.model.js
│   │   │   └── blacklist.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── song.routes.js
│   │   │   ├── playlist.routes.js
│   │   │   ├── bookmark.routes.js
│   │   │   └── recentlyPlayedSong.routes.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   └── upload.middleware.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   ├── song.validator.js
│   │   │   ├── bookmark.validator.js
│   │   │   └── recentlyPlayedSong.validator.js
│   │   ├── services/
│   │   │   └── storage.service.js
│   │   ├── utils/
│   │   │   └── token.utils.js
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── App/
│   │   │   ├── App.jsx
│   │   │   ├── app.routes.jsx
│   │   │   ├── app.store.js
│   │   │   ├── AppLayout.jsx
│   │   │   ├── providers.jsx
│   │   │   └── index.css
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── pages/
│   │   │   │   ├── service/
│   │   │   │   ├── state/
│   │   │   │   └── hook/
│   │   │   ├── bookmarks/
│   │   │   ├── dashboard/
│   │   │   ├── faceDetectExpression/
│   │   │   ├── player/
│   │   │   ├── playlists/
│   │   │   ├── recentlyPlayed/
│   │   │   ├── songs/
│   │   │   └── Shared/
│   │   └── assets/
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB database
- ImageKit account for media storage

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory with required environment variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_secret
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Frontend directory:
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the port specified by Vite)

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth authentication

### Song Endpoints
- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get song details
- `POST /api/songs` - Upload new song (authenticated)
- `DELETE /api/songs/:id` - Delete song

### Playlist Endpoints
- `GET /api/playlists` - Get user playlists
- `POST /api/playlists` - Create playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist

### Bookmark Endpoints
- `GET /api/bookmarks` - Get bookmarked songs
- `POST /api/bookmarks` - Bookmark a song
- `DELETE /api/bookmarks/:id` - Remove bookmark

### Recently Played Endpoints
- `GET /api/recently-played` - Get recently played songs
- `POST /api/recently-played` - Log played song

---

## 🎯 How It Works

1. **User Registration & Login** - Sign up or log in with email/password or Google OAuth
2. **Face Detection** - Activate the facial expression camera feature
3. **Mood Detection** - MediaPipe analyzes your facial expression and detects emotion
4. **Music Recommendation** - Songs and playlists matching your mood are recommended
5. **Explore & Enjoy** - Browse, play, bookmark, and create playlists
6. **Upload Music** - Share your own songs with the community

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**NovaVibe Development Team**

---

## 📧 Support & Contact

For support, questions, or suggestions, please create an issue in the repository or contact the development team.

---

## 🙏 Acknowledgments

- **MediaPipe** - For facial expression detection
- **ImageKit** - For cloud media storage
- **MongoDB** - For database management
- **React & Redux** - For frontend framework and state management

---

<div align="center">

**Made with ❤️ for music lovers and emotion enthusiasts**

## 🎯 Tagline

**"Feel the music. Live the vibe."**

![NovaVibe Demo 1](https://i.pinimg.com/originals/6a/c7/80/6ac780f0649e8e2497148d50edf432c3.gif)

## 🚀 Live Demo

👉 Add your deployed link here (Vercel / Netlify)

---

## 🧠 How It Works

1. 📷 Captures your face using webcam
2. 🤖 Uses MediaPipe to detect facial landmarks
3. 🎭 Classifies emotion (Happy, Sad, Surprise, Neutral)
4. 🎵 Recommends music based on detected mood

---

## ✨ Features

### 🎯 AI Mood Detection

* Real-time facial expression recognition
* Uses MediaPipe Face Landmarker
* Processes 50+ facial blendshapes

### 🎵 Smart Music Recommendation

* Suggests songs based on mood
* Dynamic emotion → playlist mapping

### 🔐 Authentication System

* JWT-based login & registration
* Secure user sessions

### 👤 Guest Mode

* Try the app without login
* Limited session access

### 📤 Song Upload System

* Upload your own songs
* Tag songs with emotions
* Expand recommendation system

### 🎨 UI/UX

* Modern responsive design
* Smooth animations using GSAP / Framer Motion
* Clean and interactive interface

---

## 🛠️ Tech Stack

| Layer     | Technology           |
| --------- | -------------------- |
| Frontend  | React.js (Vite)      |
| Backend   | Node.js, Express.js  |
| Database  | MongoDB              |
| AI/ML     | Google MediaPipe     |
| Animation | GSAP / Framer Motion |
| Auth      | JWT                  |

---

## ⚙️ Emotion Detection Logic

* 😊 **Happy** → mouthSmileLeft + mouthSmileRight
* 😲 **Surprise** → eyeWide + browInnerUp
* 😢 **Sad** → mouthFrown + frownLeft/right
* 😐 **Neutral** → baseline expression

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/NasimReja077/novavibe-ai.git

# Navigate to project folder
cd novavibe-ai

# Install dependencies
npm install

# Run frontend
npm run dev
```

---

## 📁 Project Structure

```
client/
 ├── components/
 ├── pages/
 ├── hooks/
 └── utils/

server/
 ├── controllers/
 ├── routes/
 ├── models/
 └── middleware/
```

---

## 🚧 Future Improvements

* [ ] Real-time music streaming
* [ ] Emotion history tracking
* [ ] AI model accuracy improvements
* [ ] Mobile optimization

---

## 🖼️ Preview

![img2](image.png)

---

## 🤝 Contributing

Contributions are welcome!

```bash
git checkout -b feature/new-feature
git commit -m "Add new feature"
git push origin feature/new-feature
```

---

## 📜 License

MIT License

---

## 👨‍💻 Author

**Nasim Reja Mondal**

* GitHub: <https://github.com/NasimReja077>
* Portfolio: Add your link

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
