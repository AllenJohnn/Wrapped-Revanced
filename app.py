from flask import Flask, redirect, request, session, url_for, render_template
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = "randomsecretkey"
app.config['SESSION_COOKIE_NAME'] = 'Spotify Cookie'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    sp_oauth = SpotifyOAuth(
        client_id=os.getenv('SPOTIPY_CLIENT_ID'),
        client_secret=os.getenv('SPOTIPY_CLIENT_SECRET'),
        redirect_uri=os.getenv('SPOTIPY_REDIRECT_URI'),
        scope='user-top-read'
    )
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route('/callback')
def callback():
    sp_oauth = SpotifyOAuth(
        client_id=os.getenv('SPOTIPY_CLIENT_ID'),
        client_secret=os.getenv('SPOTIPY_CLIENT_SECRET'),
        redirect_uri=os.getenv('SPOTIPY_REDIRECT_URI'),
        scope='user-top-read'
    )
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    session['token_info'] = token_info
    return redirect('/top-artists')

@app.route('/top-artists')
def top_artists():
    token_info = session.get('token_info')
    if not token_info:
        return redirect('/login')
        
    sp = spotipy.Spotify(auth=token_info['access_token'])
    results = sp.current_user_top_artists(limit=10, time_range='short_term')
    
    artists = []
    for artist in results['items']:
        artists.append({
            'name': artist['name'],
            'image': artist['images'][0]['url'] if artist['images'] else None,
            'url': artist['external_urls']['spotify']
        })
    
    return render_template('top_artists.html', artists=artists)


if __name__ == '__main__':
    app.run(debug=True)
