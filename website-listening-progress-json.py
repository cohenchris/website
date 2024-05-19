#!/bin/python3

from plexapi.server import PlexServer
from typing import List
import json
import os
import requests
import shutil
from PIL import Image
from dotenv import load_dotenv
import urllib.parse


#####################################
# Prepare environment and load Plex #
#####################################
RED = "\033[91m"
GREEN = "\033[92m"
BLUE = "\033[94m"
YELLOW = "\033[93m"
RESET = "\033[0m"

load_dotenv()
PLEX_URL = os.getenv('PLEX_URL')
PLEX_TOKEN = os.getenv('PLEX_TOKEN')

# Place that the website expects data to be
MUSIC_DATA_OUTPUT_DIR = os.getenv("MUSIC_DATA_OUTPUT_DIR")
ARTISTS_ALBUMS_OUTPUT_DIR = os.getenv("ARTISTS_ALBUMS_OUTPUT_DIR")

session = requests.Session()
session.verify = False
requests.packages.urllib3.disable_warnings()
server = PlexServer(PLEX_URL, PLEX_TOKEN, session)

artists_albums_md_template = lambda artistName: f"""---
title: "Albums - {artistName}"
layout: music
displayOption: "Albums"
url: "/music/artists/{artistName}"
artistName: "{artistName}"
---
"""

# These values are determined by inspecting images and looking at rendered size. That's the largest they can be.
MAX_ALBUM_SIZE=223
MAX_ARTIST_SIZE=211

##################################
########## JSON Defines ##########
##################################
class Track:
    def __init__(self,
                 trackName: str,
                 trackRating: float):

        self.trackName = trackName 
        self.trackRating = trackRating

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)


class Album:
    def __init__(self,
                 albumTitle: str,
                 albumArtist: str,
                 albumGenres: List[str],
                 albumLabel: str,
                 albumYear: int,
                 albumTracks: List[Track],
                 albumCover: str):

        self.albumTitle = albumTitle                                                            # album name
        self.albumArtist = albumArtist.replace(".", "")                                         # album artist
        self.albumGenres = ", ".join(albumGenres) if len(albumGenres) > 0 else "[no genres]"    # genres (comma-separated)
        self.albumLabel = albumLabel if albumLabel is not None else "[no label]"                # label released
        self.albumYear = albumYear                                                              # release year
        self.albumTracks = albumTracks                                                          # array of Track objects
        self.albumCover = albumCover                                                            # uri to cover of the album 

        # favorites
        highest = max(self.albumTracks, key=lambda t: t.trackRating).trackRating
        self.albumFavorites = []
        [self.albumFavorites.append(track) for track in self.albumTracks if track.trackRating == highest]

        # overall album rating
        total = 0
        [total := total + track.trackRating for track in self.albumTracks]
        self.albumRating = round((total / len(self.albumTracks)), 2)

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)


class Artist:
    def __init__(self,
                 artistName: str,
                 artistAlbums: List[Album],
                 artistImage: str):

        self.artistName = artistName.replace(".", "")   # name of artist
        self.artistAlbums = artistAlbums                # array of Album objects
        self.artistImage = artistImage                  # uri to image of the artist
        self.artistNumRatedAlbums = len(artistAlbums)   # number of rated albums for this artist

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, sort_keys=True, indent=4)

##################################
######## Helper Functions ########
##################################
def convert_to_webp(source, max_size):
    root, ext = os.path.splitext(source)
    destination = root + ".webp"

    # First, resize image to square, if it is not already
    image = Image.open(source)
    width, height = image.size
    new_dimension = 0
    if (width != height):
        # Resizing needed
        if (width > height):
            # Image is a horizontal rectangle
            new_dimension = height
        elif (width < height):
            # Image is a vertical rectangle
            new_dimension = width

        left = (width - new_dimension) / 2
        top = (height - new_dimension) / 2
        right = (width + new_dimension) / 2
        bottom = (height + new_dimension) / 2
        image = image.crop((left, top, right, bottom))

    # Next, resize image to max_size x max_size
    image = image.convert('RGB')
    image = image.resize((max_size, max_size))
    image.save(source)

    # Convert JPG to webp
    image.save(destination, format="webp", quality=25)

    os.remove(source);

    return destination

##################################
########## Library Scan ##########
##################################
def scan_library() -> List[Artist]:
    # Scan all artists
    artists = server.library.section("Music").searchArtists()
    library: List[Artist] = []

    # Iterate through each artist
    for artist in artists:
        albumlist: List[Album] = []
        artist_log_str = ""
        
        # Iterate through each of the artist's albums
        for album in artist.albums():
            omitAlbum = False
            tracklist: List[Track] = []

            # Determine eligible albums
            if (len(album.tracks()) <= 4):
                # If album only has 4 or fewer songs, we count it as an EP. Omit from JSON.
                artist_log_str += YELLOW + f"\t{album.title} (<4 songs)\n" + RESET
                omitAlbum = True
                continue
            
            # Iterate through each track in the given album, reading the rating from each track
            for track in album:
                # If album isn't fully rated, omit from JSON
                if track.userRating is None:
                    omitAlbum = True
                    break
                tracklist.append(Track(track.title, track.userRating))

            # Add album to output, if it is eligible
            if not omitAlbum:
                # add fully-rated albums
                artist_log_str += GREEN + f"\t{album.title}\n" + RESET
                albumlist.append(Album(
                                       album.title,
                                       artist.title,
                                       [genre.tag for genre in album.genres],
                                       album.studio,
                                       album.year,
                                       tracklist,
                                       f"{album.key}/thumb" # link to download the image, will be changed later
                                      )
                                 )
            else:
                # omit unrated albums
                artist_log_str += RED + f"\t{album.title} (unrated)\n" + RESET

        # Determine eligible artists
        if len(albumlist) > 0:
            # Sort albums high-low rating in their respective arrays
            albumlist = sorted(albumlist, key=lambda album: album.albumRating, reverse=True)

            # Add artists with 1 or more rated albums
            artist_log_str = BLUE + f"{artist.title}\n" + RESET + artist_log_str
            library.append(Artist(artist.title, albumlist, f"{artist.key}/thumb"))
        else:
            # If the artist has no rated albums, omit from JSON
            artist_log_str = BLUE + f"OMITTING {artist.title} (no fully-rated albums available)\n" + RESET + artist_log_str

        print(artist_log_str)

    return library


##########################
########## Main ##########
##########################

# Scan library for eligible albums
library = scan_library()
artists_json = []
albums_json = []
artists_albums_json = []

# Create artists_albums dir
os.chdir(ARTISTS_ALBUMS_OUTPUT_DIR)
artists_albums_dir = os.path.join(ARTISTS_ALBUMS_OUTPUT_DIR, "artists_albums")
# Remove existing directory tree, if it exists
try:
    shutil.rmtree(artists_albums_dir)
except FileNotFoundError:
    pass
os.mkdir(artists_albums_dir)
os.chdir(artists_albums_dir)

# Create music_data dir
os.chdir(MUSIC_DATA_OUTPUT_DIR)
music_data_dir = os.path.join(MUSIC_DATA_OUTPUT_DIR, "music_data")
# Remove existing directory tree, if it exists
try:
    shutil.rmtree(music_data_dir)
except FileNotFoundError:
    pass
os.mkdir(music_data_dir)
os.chdir(music_data_dir)

# For each valid artist/albums, create a directory for each artist, with supporting metadata
for artist in library:
    # make artist directory, if it doesn't exist already
    artist_dir = os.path.join(music_data_dir, artist.artistName)
    os.mkdir(artist_dir)
    # download artist image
    artist_image_path = os.path.join(artist_dir, "image.jpg")
    with open(artist_image_path, "wb") as image:
        response = requests.get(f"{PLEX_URL}{artist.artistImage}?X-Plex-Token={PLEX_TOKEN}", verify=False)
        image.write(response.content)
        artist.artistImage = "/music_data/" + artist.artistName + "/image.webp"; # path for Hugo to find the image
        artist.artistImage = urllib.parse.quote(artist.artistImage) # Make paths valid URLs (in case of any special chars)
    # Convert to webp for better performance
    convert_to_webp(artist_image_path, MAX_ARTIST_SIZE)

    # Create Hugo md for artist
    hugo_artist_md_path = os.path.join(artists_albums_dir, artist.artistName + ".md")
    with open(hugo_artist_md_path, "w") as f:
        f.write(artists_albums_md_template(artist.artistName))

    for album in artist.artistAlbums:
        # make album directories
        album.albumTitle = album.albumTitle.replace("/", "+")  # temp fix for album names with a slash - breaks the next statements
        album_dir = os.path.join(artist_dir, album.albumTitle)
        try:
            os.mkdir(album_dir)
        except FileExistsError:
            pass

        # download album art
        album_cover_path = os.path.join(album_dir, "cover.jpg")
        if not os.path.isfile(album_cover_path):
            # Only get cover if it doesn't exist
            with open(album_cover_path, "wb") as cover:
                response = requests.get(f"{PLEX_URL}{album.albumCover}?X-Plex-Token={PLEX_TOKEN}", verify=False)
                cover.write(response.content)
                album.albumCover = "/music_data/" + album.albumArtist + "/" + album.albumTitle + "/cover.webp"
                album.albumCover = urllib.parse.quote(album.albumCover) # Make paths valid URLs (in case of any special chars)
            # Convert to webp for better performance
            convert_to_webp(album_cover_path, MAX_ALBUM_SIZE)

        # Append to albums JSON
        albums_json.append({key: value for key, value in album.__dict__.items()})
        artists_albums_json.append({key: value for key, value in album.__dict__.items()})

    # Write artist's albums JSON
    artist_json_path = os.path.join(artist_dir, "albums.json")
    with open(artist_json_path, "w") as f:
        f.write(json.dumps(artists_albums_json, default=lambda o: o.__dict__, indent=4, ensure_ascii=True))
    artists_albums_json = []

    # Append to artists JSON
    artists_json.append({key: value for key, value in artist.__dict__.items() if key != "artistAlbums"})

# Write artists.json
with open("artists.json", "w") as f:
    f.write(json.dumps(artists_json, default=lambda o: o.__dict__, indent=4, ensure_ascii=True))

# Write albums.json
with open("albums.json", "w") as f:
    f.write(json.dumps(albums_json, default=lambda o: o.__dict__, indent=4, ensure_ascii=True))

