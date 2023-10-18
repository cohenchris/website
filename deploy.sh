#!/bin/bash

starting_dir=$(pwd)
cd "$(dirname "$0")"

# Font subset
./get-all-chars.py space.ttf

# Sync music listening progress metadata
python3 ./website-listening-progress-json.py

# Get Resume JPG, convert to webp, and resize
wget https://raw.githubusercontent.com/cohenchris/resume/master/ChrisCohen_resume.jpg
cwebp -q 80 ChrisCohen_resume.jpg -o static/images/ChrisCohen_resume.webp
cwebp -resize 800 1131 static/images/ChrisCohen_resume.webp -o static/images/ChrisCohen_resume.webp
rm ChrisCohen_resume.jpg

# Generate and deploy to server
hugo

mv public/ html/

rm -r /home/phrog/server/config/swag/www/chriscohen.dev/html

mv html /home/phrog/server/config/swag/www/chriscohen.dev/

cd $starting_dir

echo "Don't forget to commit!"
