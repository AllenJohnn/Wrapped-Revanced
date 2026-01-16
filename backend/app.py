from flask import Flask, redirect, request, jsonify, session
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth
from spotipy.exceptions import SpotifyException
import os
import logging
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per hour", "50 per minute"],
    storage_uri="memory://"
)

allowed_origins = os.getenv("FRONTEND_URL", "http://localhost:5173").split(",")
CORS(app, 
     origins=allowed_origins,
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

app.secret_key = os.getenv("SECRET_KEY", os.urandom(24))
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

required_env_vars = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "SPOTIFY_REDIRECT_URI"]
missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")

sp_oauth = SpotifyOAuth(
    client_id=os.getenv("SPOTIFY_CLIENT_ID"),
    client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
    redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
    scope="user-top-read user-read-recently-played user-read-private",
    cache_handler=None
)


@app.route('/')
def home():
    return jsonify({
        "message": "Spotify Wrapped Revanced API",
        "version": "2.0",
        "endpoints": {
            "login": "/api/login",
            "callback": "/callback",
            "top_tracks": "/api/top-tracks",
            "top_artists": "/api/top-artists",
            "user_profile": "/api/me",
            "stats": "/api/stats"
        }
    })


@app.route('/api/login')
@limiter.limit("10 per minute")
def login():
<<<<<<< HEAD
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)
=======
    try:
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({"error": "Failed to initiate login"}), 500
>>>>>>> cfdb5eb (latest fixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)


@app.route('/callback')
@limiter.limit("10 per minute")
def callback():
<<<<<<< HEAD
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    access_token = token_info['access_token']

    return redirect(f"http://127.0.0.1:5173?token={access_token}")
=======
    try:
        code = request.args.get('code')
        error = request.args.get('error')
        
        if error:
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
            return redirect(f"{frontend_url}?error={error}")
        
        if not code:
            return jsonify({"error": "No authorization code provided"}), 400
        
        token_info = sp_oauth.get_access_token(code, check_cache=False)
        access_token = token_info['access_token']
        refresh_token = token_info.get('refresh_token')
        
        session['access_token'] = access_token
        session['refresh_token'] = refresh_token
        session.permanent = True
        
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        return redirect(f"{frontend_url}?token={access_token}")
    except Exception as e:
        logger.error(f"Callback error: {e}")
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        return redirect(f"{frontend_url}?error=auth_failed")


def get_spotify_client(token):
    if not token:
        return None
    try:
        return Spotify(auth=token)
    except Exception as e:
        logger.error(f"Spotify client creation error: {e}")
        return None
>>>>>>> cfdb5eb (latest fixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)


@app.route('/api/top-tracks')
def top_tracks():
    try:
        token = request.args.get("token")
        time_range = request.args.get("time_range", "short_term")
        limit = min(int(request.args.get("limit", 50)), 50)
        
        if not token:
            return jsonify({"error": "Missing token"}), 400
        
        sp = get_spotify_client(token)
        if not sp:
            return jsonify({"error": "Invalid token"}), 401
        
        results = sp.current_user_top_tracks(limit=limit, time_range=time_range)
        
        tracks = [{
            "id": item['id'],
            "name": item['name'],
            "artist": item['artists'][0]['name'],
            "artists": [{"name": a['name'], "id": a['id']} for a in item['artists']],
            "album": item['album']['name'],
            "image": item['album']['images'][0]['url'] if item['album']['images'] else None,
            "image_medium": item['album']['images'][1]['url'] if len(item['album']['images']) > 1 else None,
            "preview_url": item.get('preview_url'),
            "external_url": item['external_urls']['spotify'],
            "duration_ms": item['duration_ms'],
            "popularity": item.get('popularity', 0)
        } for item in results['items']]
        
        return jsonify(tracks)
    except SpotifyException as e:
        logger.error(f"Spotify API error: {e}")
        return jsonify({"error": "Failed to fetch top tracks", "details": str(e)}), 500
    except Exception as e:
        logger.error(f"Top tracks error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/api/top-artists')
def top_artists():
    try:
        token = request.args.get("token")
        time_range = request.args.get("time_range", "short_term")
        limit = min(int(request.args.get("limit", 50)), 50)
        
        if not token:
            return jsonify({"error": "Missing token"}), 400
        
        sp = get_spotify_client(token)
        if not sp:
            return jsonify({"error": "Invalid token"}), 401
        
        results = sp.current_user_top_artists(limit=limit, time_range=time_range)
        
        artists = [{
            "id": artist['id'],
            "name": artist['name'],
            "image": artist['images'][0]['url'] if artist['images'] else None,
            "image_medium": artist['images'][1]['url'] if len(artist['images']) > 1 else None,
            "genres": artist['genres'],
            "popularity": artist.get('popularity', 0),
            "followers": artist['followers']['total'],
            "external_url": artist['external_urls']['spotify']
        } for artist in results['items']]
        
        return jsonify(artists)
    except SpotifyException as e:
        logger.error(f"Spotify API error: {e}")
        return jsonify({"error": "Failed to fetch top artists", "details": str(e)}), 500
    except Exception as e:
        logger.error(f"Top artists error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/api/me")
def get_user_profile():
    try:
        token = request.args.get("token")
        if not token:
            return jsonify({"error": "Missing token"}), 400
        
        sp = get_spotify_client(token)
        if not sp:
            return jsonify({"ok": False, "error": "Invalid token"}), 401
        
        profile = sp.current_user()
        return jsonify({
            "ok": True,
            "user": {
                "id": profile['id'],
                "display_name": profile.get('display_name'),
                "email": profile.get('email'),
                "country": profile.get('country'),
                "image": profile['images'][0]['url'] if profile.get('images') else None,
                "followers": profile['followers']['total'],
                "product": profile.get('product')
            }
        })
    except SpotifyException as e:
        logger.error(f"Spotify API error: {e}")
        return jsonify({"ok": False, "error": "Failed to fetch profile"}), 500
    except Exception as e:
        logger.error(f"Profile error: {e}")
        return jsonify({"ok": False, "error": "Internal server error"}), 500


@app.route("/api/stats")
def get_stats():
    try:
        token = request.args.get("token")
        time_range = request.args.get("time_range", "short_term")
        
        if not token:
            return jsonify({"error": "Missing token"}), 400
        
        sp = get_spotify_client(token)
        if not sp:
            return jsonify({"error": "Invalid token"}), 401
        
        tracks = sp.current_user_top_tracks(limit=50, time_range=time_range)
        artists = sp.current_user_top_artists(limit=50, time_range=time_range)
        
        total_duration = sum(track['duration_ms'] for track in tracks['items'])
        unique_artists = len(set(artist['name'] for track in tracks['items'] for artist in track['artists']))
        
        all_genres = []
        for artist in artists['items']:
            all_genres.extend(artist['genres'])
        
        genre_counts = {}
        for genre in all_genres:
            genre_counts[genre] = genre_counts.get(genre, 0) + 1
        
        top_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        stats = {
            "total_tracks": len(tracks['items']),
            "total_artists": unique_artists,
            "total_listening_time_ms": total_duration,
            "total_listening_time_hours": round(total_duration / (1000 * 60 * 60), 2),
            "top_genres": [{"name": genre, "count": count} for genre, count in top_genres],
            "average_track_duration_ms": total_duration // len(tracks['items']) if tracks['items'] else 0,
            "time_range": time_range
        }
        
        return jsonify(stats)
    except Exception as e:
        logger.error(f"Stats error: {e}")
        return jsonify({"error": "Failed to fetch statistics"}), 500


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    port = int(os.getenv("PORT", 5000))
    app.run(debug=debug_mode, host="0.0.0.0", port=port)
