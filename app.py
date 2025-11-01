from flask import Flask, redirect, request, session, jsonify
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os
import time

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'randomsecretkey')

# ✅ Sessions + CORS for React (localhost:5173)
app.config['SESSION_COOKIE_NAME'] = 'SpotifyCookie'
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}})

# ---------- Helper Functions ----------
def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=os.getenv('SPOTIPY_CLIENT_ID'),
        client_secret=os.getenv('SPOTIPY_CLIENT_SECRET'),
        redirect_uri=os.getenv('SPOTIPY_REDIRECT_URI'),
        scope='user-top-read user-read-recently-played'
    )

def get_token():
    token_info = session.get('token_info', None)
    if not token_info:
        raise Exception("No token info found. Please log in again.")

    now = int(time.time())
    if token_info['expires_at'] - now < 60:
        sp_oauth = create_spotify_oauth()
        token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
        session['token_info'] = token_info

    return token_info['access_token']

# ---------- Routes ----------
@app.route('/')
def home():
    return "✅ Flask backend is running. Open http://localhost:5173 for the React app."

@app.route('/login')
def login():
    sp_oauth = create_spotify_oauth()
    return redirect(sp_oauth.get_authorize_url())

@app.route('/callback')
def callback():
    sp_oauth = create_spotify_oauth()
    code = request.args.get("code")

    if not code:
        return redirect("http://localhost:5173")

    token_info = sp_oauth.get_access_token(code)
    session['token_info'] = token_info

    # ✅ Redirect back with token in URL
    return redirect(f"http://localhost:5173/?token={token_info['access_token']}")

@app.route('/api/profile')
def profile():
    try:
        token = get_token()
        sp = spotipy.Spotify(auth=token)
        user = sp.current_user()
        return jsonify(user), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

@app.route('/api/top-artists')
def top_artists():
    try:
        token = get_token()
        sp = spotipy.Spotify(auth=token)
        items = sp.current_user_top_artists(limit=10, time_range="medium_term")['items']

        return jsonify([{
            "name": a["name"],
            "image": a["images"][0]["url"] if a["images"] else None,
            "genre": a["genres"][0] if a["genres"] else "Unknown"
        } for a in items]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 401

@app.route('/api/top-tracks')
def top_tracks():
    try:
        token = get_token()
        sp = spotipy.Spotify(auth=token)
        items = sp.current_user_top_tracks(limit=10, time_range="medium_term")['items']

        return jsonify([{
            "name": t["name"],
            "artist": t["artists"][0]["name"] if t["artists"] else "Unknown",
            "image": t["album"]["images"][0]["url"] if t["album"]["images"] else None
        } for t in items]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 401

if __name__ == "__main__":
    app.run(port=5000, debug=True)
