#!/bin/bash

starting_dir=$(pwd)
cd "$(dirname "$0")"

# Font subset
./get-all-chars.py space.ttf

# Get Resume JPG, convert to webp, and resize
wget https://raw.githubusercontent.com/cohenchris/resume/master/ChrisCohen_resume.jpg
convert ChrisCohen_resume.jpg -resize 798x1128 ChrisCohen_resume.jpg
cwebp -q 50 ChrisCohen_resume.jpg -o static/images/ChrisCohen_resume.webp
rm ChrisCohen_resume.jpg

# Sync music listening progress metadata
python3 ./website-listening-progress-json.py

if [ "$1" != "test" ]; then
  # Generate and deploy to server
  hugo

  mv public/ html/

  rm -r /home/phrog/server/config/swag/www/chriscohen.dev/html

  mv html /home/phrog/server/config/swag/www/chriscohen.dev/

  cd $starting_dir
fi

echo "Don't forget to commit!"
