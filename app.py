import os
import pandas as pd
import matplotlib.pyplot as plt
import io
import base64
from flask import Flask, redirect, request
from spotipy.oauth2 import SpotifyOAuth
import spotipy
from dotenv import load_dotenv

# Used To Load client ID/secret from .env file
load_dotenv()  

app = Flask(__name__)

sp_oauth = SpotifyOAuth(
    client_id=os.getenv("0b5569103113480eacefe0bc16793cf0"),
    client_secret=os.getenv("f95be492790748f4a5f71bc51f10cc5e"),
    redirect_uri=os.getenv("http://127.0.0.1:5000/callback"),
    scope="user-top-read user-read-recently-played"
)

@app.route('/callback')
def callback():
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    sp = spotipy.Spotify(auth=token_info['access_token'])

    user = sp.current_user()
    top_artists = sp.current_user_top_artists(limit=10, time_range='medium_term')['items']

    # Prepare data for visualization
    artist_names = [artist['name'] for artist in top_artists]
    artist_popularity = [artist['popularity'] for artist in top_artists]

    df = pd.DataFrame({
        'Artist': artist_names,
        'Popularity': artist_popularity
    })

    # Plot bar chart
    plt.figure(figsize=(8,5))
    plt.barh(df['Artist'], df['Popularity'], color='limegreen')
    plt.xlabel('Popularity')
    plt.ylabel('Artist')
    plt.title(f"{user['display_name']}'s Top Artists (Medium Term)")
    plt.gca().invert_yaxis()

    # Convert plot to base64 image for display
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()

    html = f"<h1>Welcome, {user['display_name']}!</h1>"
    html += "<img src='data:image/png;base64,{}'>".format(img_base64)
    return html


if __name__ == '__main__':
    app.run(debug=True)
