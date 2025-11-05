from flask import Flask, redirect, request, session, jsonify, render_template
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import os
import time
from dotenv import load_dotenv
import logging

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "defaultsecret")
app.config['SESSION_COOKIE_NAME'] = 'SpotifyCookie'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Configure logging
logging.basicConfig(level=logging.INFO)

# CORS configuration for React
CORS(app, 
     origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=os.getenv("SPOTIPY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIPY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIPY_REDIRECT_URI"),
        scope="user-read-private user-read-email user-top-read"
    )

def get_token():
    token_info = session.get("token_info", None)
    if not token_info:
        raise Exception("User not logged in")
    if token_info['expires_at'] - int(time.time()) < 60:
        oauth = create_spotify_oauth()
        token_info = oauth.refresh_access_token(token_info['refresh_token'])
        session['token_info'] = token_info
    return token_info

@app.route("/")
def home():
    return "🎵 Spotify Wrapped Backend is Running! Use the React frontend at http://localhost:5173"

@app.route("/api/health")
def health_check():
    return jsonify({"status": "healthy", "service": "Spotify Flask API"})

@app.route("/api/login")
def login():
    auth_url = create_spotify_oauth().get_authorize_url()
    return redirect(auth_url)

@app.route("/api/callback")
def callback():
    try:
        code = request.args.get("code")
        if not code:
            return jsonify({"error": "No authorization code provided"}), 400
            
        token_info = create_spotify_oauth().get_access_token(code)
        session["token_info"] = token_info
        return redirect("http://localhost:5173/")
    except Exception as e:
        logging.error(f"Callback error: {str(e)}")
        return jsonify({"error": "Authentication failed"}), 500

@app.route("/api/profile")
def profile():
    try:
        token = get_token()['access_token']
        sp = spotipy.Spotify(auth=token)
        user = sp.current_user()
        return jsonify({
            "name": user.get("display_name"),
            "email": user.get("email"),
            "image": user["images"][0]["url"] if user.get("images") else None,
            "id": user.get("id")
        })
    except Exception as e:
        logging.error(f"Profile error: {str(e)}")
        return jsonify({"error": "Failed to fetch profile"}), 401

@app.route("/api/top-artists")
def top_artists():
    try:
        valid_ranges = ['short_term', 'medium_term', 'long_term']
        time_range = request.args.get('time_range', 'medium_term')
        
        if time_range not in valid_ranges:
            return jsonify({"error": "Invalid time range"}), 400
            
        token = get_token()['access_token']
        sp = spotipy.Spotify(auth=token)
        artists = sp.current_user_top_artists(limit=10, time_range=time_range)['items']
        
        return jsonify([{
            "name": a["name"],
            "genre": a["genres"][0] if a["genres"] else "Unknown",
            "image": a["images"][0]["url"] if a["images"] else None,
            "id": a["id"],
            "popularity": a["popularity"]
        } for a in artists])
    except Exception as e:
        logging.error(f"Top artists error: {str(e)}")
        return jsonify({"error": "Failed to fetch top artists"}), 401

@app.route("/api/top-tracks")
def top_tracks():
    try:
        valid_ranges = ['short_term', 'medium_term', 'long_term']
        time_range = request.args.get('time_range', 'medium_term')
        
        if time_range not in valid_ranges:
            return jsonify({"error": "Invalid time range"}), 400
            
        token = get_token()['access_token']
        sp = spotipy.Spotify(auth=token)
        tracks = sp.current_user_top_tracks(limit=10, time_range=time_range)['items']
        
        return jsonify([{
            "name": t["name"],
            "artist": t["artists"][0]["name"],
            "image": t["album"]["images"][0]["url"] if t["album"]["images"] else None,
            "id": t["id"],
            "duration_ms": t["duration_ms"]
        } for t in tracks])
    except Exception as e:
        logging.error(f"Top tracks error: {str(e)}")
        return jsonify({"error": "Failed to fetch top tracks"}), 401

@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})

if __name__ == "__main__":
    print("🚀 Starting Spotify Wrapped Flask Backend...")
    app.run(debug=True, port=5000)