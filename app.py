from flask import Flask, redirect, request, session, url_for, render_template
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os
import time

load_dotenv()

app = Flask(__name__)
app.secret_key = "randomsecretkey"
app.config['SESSION_COOKIE_NAME'] = 'Spotify Cookie'

# ---- Helper Function ----
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
        raise Exception("No token info found, please log in again.")

    # Refresh token if expired
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
    return render_template('index.html')


@app.route('/login')
def login():
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)


@app.route('/callback')
def callback():
    sp_oauth = create_spotify_oauth()
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    session['token_info'] = token_info
    return redirect(url_for('wrapped'))


@app.route('/top-artists')
def top_artists():
    try:
        token_info = get_token()
        sp = spotipy.Spotify(auth=token_info['access_token'])
        artists = sp.current_user_top_artists(limit=5, time_range='medium_term')['items']

        top_artists_data = [
            {"name": a['name'], "image": a['images'][0]['url'] if a['images'] else None, "genre": a['genres'][0] if a['genres'] else "Unknown"}
            for a in artists
        ]
        return render_template('top_artists.html', artists=top_artists_data)
    except:
        return redirect(url_for('login'))


@app.route('/top-tracks')
def top_tracks():
    try:
        token_info = get_token()
        sp = spotipy.Spotify(auth=token_info['access_token'])
        tracks = sp.current_user_top_tracks(limit=5, time_range='medium_term')['items']

        top_tracks_data = [
            {
                "name": t['name'],
                "artist": t['artists'][0]['name'] if t['artists'] else "Unknown",
                "image": t['album']['images'][0]['url'] if t['album']['images'] else None
            }
            for t in tracks
        ]
        return render_template('top_tracks.html', tracks=top_tracks_data)
    except:
        return redirect(url_for('login'))


@app.route('/wrapped')
def wrapped():
    try:
        token_info = get_token()
        sp = spotipy.Spotify(auth=token_info['access_token'])

        # Top artist and track
        top_artists = sp.current_user_top_artists(limit=1, time_range='short_term')
        top_tracks = sp.current_user_top_tracks(limit=1, time_range='short_term')

        artist_name = top_artists['items'][0]['name'] if top_artists['items'] else "Unknown Artist"
        genre = top_artists['items'][0]['genres'][0].title() if top_artists['items'] and top_artists['items'][0]['genres'] else "Unknown Genre"
        top_track = top_tracks['items'][0]['name'] if top_tracks['items'] else "Unknown Track"

        # Listening hours (approximation)
        recent = sp.current_user_recently_played(limit=50)
        total_ms = sum(item['track']['duration_ms'] for item in recent['items'])
        total_hours = total_ms / (1000 * 60 * 60)

        return render_template(
            'wrapped.html',
            artist=artist_name,
            genre=genre,
            track=top_track,
            hours=f"{total_hours:.1f}"
        )
    except:
        return redirect(url_for('login'))


# ---- Main ----
if __name__ == '__main__':
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True)
