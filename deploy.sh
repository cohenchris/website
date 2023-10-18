#!/bin/bash

starting_dir=$(pwd)
cd "$(dirname "$0")"

# Font subset
./get-all-chars.py

python3 ./website-listening-progress-json.py

hugo

mv public/ html/

rm -r /home/phrog/server/config/swag/www/chriscohen.dev/html

mv html /home/phrog/server/config/swag/www/chriscohen.dev/

cd $starting_dir

echo "Don't forget to commit!"
