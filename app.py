from flask import Flask, redirect, request, session, jsonify
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
import time
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "defaultsecret")
app.config['SESSION_COOKIE_NAME'] = 'SpotifyCookie'

# ✅ Allow React app to access API
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# ✅ Helper: OAuth setup
def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=os.getenv("SPOTIPY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
        scope="user-read-private user-read-email user-top-read"
    )

# ✅ Helper: Token management
def get_token():
    token_info = session.get('token_info', None)

    if not token_info:
        raise Exception("No token found, login again.")

    now = time.time()
    is_expired = token_info['expires_at'] - now < 60

    if is_expired:
        spotify_oauth = create_spotify_oauth()
        token_info = spotify_oauth.refresh_access_token(token_info['refresh_token'])
        session['token_info'] = token_info

    return token_info

@app.route("/")
def home():
    return "✅ Flask backend is running."

@app.route("/login")
def login():
    oauth = create_spotify_oauth()
    auth_url = oauth.get_authorize_url()
    return redirect(auth_url)

@app.route("/callback")
def callback():
    oauth = create_spotify_oauth()
    code = request.args.get("code")

    token_info = oauth.get_access_token(code)
    session['token_info'] = token_info

    return redirect(f"http://localhost:5173?token={token_info['access_token']}")

# ✅ NEW: Profile route
@app.route("/api/profile")
def profile():
    try:
        token = get_token()["access_token"]
        sp = spotipy.Spotify(auth=token)
        user = sp.current_user()

        return jsonify({
            "name": user["display_name"],
            "email": user.get("email"),
            "image": user["images"][0]["url"] if user["images"] else None
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

# ✅ Top Artists API
@app.route("/api/top-artists")
def top_artists():
    try:
        token = get_token()["access_token"]
        sp = spotipy.Spotify(auth=token)
        artists = sp.current_user_top_artists(limit=10, time_range="medium_term")["items"]

        return jsonify([
            {
                "name": a["name"],
                "genre": a["genres"][0] if a["genres"] else "Unknown",
                "image": a["images"][0]["url"] if a["images"] else None
            } for a in artists
        ]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

# ✅ Top Tracks API
@app.route("/api/top-tracks")
def top_tracks():
    try:
        token = get_token()["access_token"]
        sp = spotipy.Spotify(auth=token)
        tracks = sp.current_user_top_tracks(limit=10, time_range="medium_term")["items"]

        return jsonify([
            {
                "name": t["name"],
                "artist": t["artists"][0]["name"],
                "image": t["album"]["images"][0]["url"] if t["album"]["images"] else None
            } for t in tracks
        ]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

if __name__ == "__main__":
    app.run(debug=True, port=5000)
