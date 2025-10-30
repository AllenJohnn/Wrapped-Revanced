from flask import Flask, redirect, request, session, jsonify
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from flask_cors import CORS
from dotenv import load_dotenv
import os
import time

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'randomsecretkey')
app.config['SESSION_COOKIE_NAME'] = 'SpotifyCookie'
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

# ---- Helper Functions ----
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
    is_expired = token_info['expires_at'] - now < 60
    if is_expired:
        sp_oauth = create_spotify_oauth()
        token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
        session['token_info'] = token_info

    return token_info

# ---- Routes ----
@app.route('/')
def index():
    return "✅ Flask server running — visit http://localhost:5173 to use the React app."

@app.route('/login')
def login():
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    print("🔗 Redirecting to Spotify:", auth_url)
    return redirect(auth_url)

@app.route('/callback')
def callback():
    sp_oauth = create_spotify_oauth()
    code = request.args.get('code')

    if code:
        token_info = sp_oauth.get_access_token(code)
        session['token_info'] = token_info
        print("✅ Token saved successfully!")

        # ✅ Redirect back to React app with token in URL
        return redirect(f"http://localhost:5173/?token={token_info['access_token']}")
    else:
        print("❌ No code found in callback URL.")
        return redirect('http://localhost:5173')

@app.route('/api/top-artists')
def api_top_artists():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            raise Exception("Missing Authorization header")

        token = auth_header.split(" ")[1]
        sp = spotipy.Spotify(auth=token)
        artists = sp.current_user_top_artists(limit=5, time_range='medium_term')['items']

        return jsonify([
            {
                "name": a['name'],
                "image": a['images'][0]['url'] if a['images'] else None,
                "genre": a['genres'][0] if a['genres'] else "Unknown"
            }
            for a in artists
        ])
    except Exception as e:
        print("❌ Error fetching top artists:", e)
        return jsonify({"error": str(e)}), 401

@app.route('/api/top-tracks')
def api_top_tracks():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            raise Exception("Missing Authorization header")

        token = auth_header.split(" ")[1]
        sp = spotipy.Spotify(auth=token)
        tracks = sp.current_user_top_tracks(limit=5, time_range='medium_term')['items']

        return jsonify([
            {
                "name": t['name'],
                "artist": t['artists'][0]['name'] if t['artists'] else "Unknown",
                "image": t['album']['images'][0]['url'] if t['album']['images'] else None
            }
            for t in tracks
        ])
    except Exception as e:
        print("❌ Error fetching top tracks:", e)
        return jsonify({"error": str(e)}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5000)
