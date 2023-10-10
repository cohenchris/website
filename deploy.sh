#!/bin/bash

starting_dir=$(pwd)
cd "$(dirname "$0")"

python3 ./website-listening-progress-json.py

hugo

mv public/ html/

rm -r /home/phrog/server/config/swag/www/chriscohen.dev/html

mv html /home/phrog/server/config/swag/www/chriscohen.dev/

cd $starting_dir
