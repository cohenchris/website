#!/bin/bash

hugo

mv public/ html/

rm -r /home/phrog/server/config/swag/www/chriscohen.dev/html

mv html /home/phrog/server/config/swag/www/chriscohen.dev/
