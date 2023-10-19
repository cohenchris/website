#!/bin/bash

starting_dir=$(pwd)
cd "$(dirname "$0")"

# Font subset
./get-all-chars.py space.ttf

# Get Resume PNG, convert to webp, and resize
wget https://raw.githubusercontent.com/cohenchris/resume/master/ChrisCohen_resume.png
convert ChrisCohen_resume.png -resize 798x1128 ChrisCohen_resume.png
cwebp -q 50 ChrisCohen_resume.png-o static/images/ChrisCohen_resume.webp
rm ChrisCohen_resume.png

# Sync music listening progress metadata
python3 ./website-listening-progress-json.py

if [ "$1" != "test" ]; then
  # Generate and deploy to server
  hugo

  mv public/ html/

  rm -r /home/phrog/server/config/swag/www/chriscohen.dev/html

  mv html /home/phrog/server/config/swag/www/chriscohen.dev/
fi

cd $starting_dir

echo "Don't forget to commit!"
