from flask import Flask, redirect, request, jsonify
from flask_cors import CORS
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.secret_key = os.urandom(24)

sp_oauth = SpotifyOAuth(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
    scope="user-top-read user-read-recently-played"
)


@app.route('/')
def home():
    return jsonify({"message": "Go to /api/login to sign in"})


@app.route('/api/login')
def login():
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)


@app.route('/callback')
def callback():
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    access_token = token_info['access_token']

    return redirect(f"http://127.0.0.1:5173?token={access_token}")


@app.route('/api/top-tracks')
def top_tracks():
    token = request.args.get("token")
    if not token:
        return jsonify({"error": "Missing token"}), 400

    sp = Spotify(auth=token)
    results = sp.current_user_top_tracks(limit=10, time_range='short_term')

    tracks = [{
        "name": item['name'],
        "artist": item['artists'][0]['name'],
        "album": item['album']['name'],
        "image": item['album']['images'][1]['url']
    } for item in results['items']]

    return jsonify(tracks)


@app.route('/api/top-artists')
def top_artists():
    token = request.args.get("token")
    if not token:
        return jsonify({"error": "Missing token"}), 400

    sp = Spotify(auth=token)
    results = sp.current_user_top_artists(limit=10, time_range='short_term')

    artists = [{
        "name": artist['name'],
        "image": artist['images'][1]['url'] if artist['images'] else None,
        "genres": artist['genres'][:2] if artist['genres'] else []
    } for artist in results['items']]

    return jsonify(artists)


@app.route("/api/me")
def get_user_profile():
    token = request.args.get("token")
    sp = Spotify(auth=token)
    try:
        profile = sp.current_user()
        return jsonify({"ok": True, "user": profile})
    except:
        return jsonify({"ok": False}), 401


if __name__ == "__main__":
    app.run(debug=True)
