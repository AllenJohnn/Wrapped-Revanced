<p align="center">
<img src="spotify.png" alt="Wrapped Revanced Banner" width="500"/>
</p>

# Wrapped Revanced

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white"/>
  <img src="https://img.shields.io/badge/Spotify-1DB954?style=flat-square&logo=spotify&logoColor=white"/>
</p>

<p align="center">
  View your Spotify Wrapped anytime with a minimalist black and white interface.
</p>

## Overview

A recreated Spotify Wrapped experience that you can access whenever you want. View your top tracks, artists, and listening statistics with a clean, modern interface.

**Stack:** React, Vite, Flask, Spotipy

## Features

- Secure Spotify OAuth authentication
- Top tracks with album art preview on hover
- Top artists with genre tags
- Time range selection (4 weeks, 6 months, all time)
- Shareable summary cards


## Quick Start

### Prerequisites

- Python 3.13+
- Node.js 18+
- Spotify Developer Account

### Spotify API Setup

1. Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Add redirect URI: `http://localhost:5000/callback`
4. Save your Client ID and Client Secret

### Installation

**Backend**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/callback
FRONTEND_URL=http://localhost:5173
SECRET_KEY=your_random_secret_key
```

**Frontend**

```bash
cd frontend
npm install
```

### Run

Start both servers in separate terminals:

```bash
# Terminal 1 - Backend
cd backend
.venv\Scripts\activate
python app.py
```

```bash
# Terminal 2 - Frontend
cd frontend
npm run dev
```

Access at `http://localhost:5173`

## Tech Stack

**Frontend**
- React 19
- Vite 6
- Framer Motion
- TanStack Query
- Zustand
- TailwindCSS

**Backend**
- Flask 3
- Python 3.13
- Spotipy 2.24


## Author

**Allen John**
- Portfolio: [allenjohn-portfolio.vercel.app](https://allenjohn-portfolio.vercel.app)
- GitHub: [@AllenJohnn](https://github.com/AllenJohnn)
- LinkedIn: [Allen John Joy](https://www.linkedin.com/in/allenjohnjoy/)

---

<<<<<<< HEAD
##  Features

| Feature | Description |
|--------|-------------|
|  **Spotify Login** | Authenticates securely with Spotify OAuth |
|  **Top Tracks** | Ranked list with album art & artist names |
|  **Top Artists** | Circular artist layout, Spotify style |
|  **Spotify Black UI** | Inspired by Sound Capsule aesthetics |
|  **Shareable Summary Card** | Save as image, perfect for stories |
|  Fast & Modern | Built using Vite + React + Framer Motion |

---

##  Tech Stack

| Layer | Tools |
|------|------|
| Frontend | React, Vite, Framer Motion |
| Backend | Flask, Python, Spotipy |
| Auth | Spotify OAuth 2.0 |
| Styling | Custom Spotify UI Theme |

---
=======
<p align="center">2026 • Allen John</p>

