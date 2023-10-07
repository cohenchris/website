#!/bin/bash

hugo

mv public/* /home/phrog/server/config/swag/www/chriscohen.dev/html
rm -r public
