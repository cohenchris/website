#!/bin/bash

python3 ./website-listening-progress-json.py

hugo

mv public/ html/

rm -r /home/phrog/server/config/swag/www/chriscohen.dev/html

mv html /home/phrog/server/config/swag/www/chriscohen.dev/
