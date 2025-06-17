#!/bin/bash

LOCAL_MACHINE_IP="lab.lan"
WEBSITE_DEPLOY_DIR="/home/phrog/server/config/swag/www/chriscohen.dev"
RESUME_URL="https://raw.githubusercontent.com/cohenchris/resume/master/ChrisCohen_resume.png"

cd "$(dirname "$0")"

# Ensure plexapi is installed
if ! python3 -c "import plexapi" &> /dev/null; then
  paru -Syu --noconfirm python-plexapi
fi

# Ensure hugo is installed
if ! command -v hugo &> /dev/null; then
  paru -Syu --noconfirm hugo
fi

# Ensure woff2 is installed
if ! command -v woff2_compress &> /dev/null; then
  paru -Syu --noconfirm woff2
fi

# Ensure pyftsubset is installed
if ! command -v pyftsubset &> /dev/null; then
  paru -Syu --noconfirm python-fonttools
fi



# Font subset
python3 ./get-all-chars.py space.ttf

# Use my wgetrc, which moves .wget-hsts from ~/ to ~/.cache
export WGETRC=/home/${USER}/.config/wget/wgetrc

# Get Resume PNG, convert to webp, and resize
RESUME_ORIGINAL_FILENAME=$(basename "${RESUME_URL}")
RESUME_FILE_BASENAME=${RESUME_ORIGINAL_FILENAME%.*}
wget "${RESUME_URL}"
cwebp "${RESUME_ORIGINAL_FILENAME}" -o "static/images/${RESUME_FILE_BASENAME}.webp" -q 80
rm "${RESUME_ORIGINAL_FILENAME}"

# Sync music listening progress metadata
python3 ./website-listening-progress-json.py

if [ "$1" != "test" ]; then
  # Generate and deploy to server
  hugo

  mv public/ html/

  rm -r "${WEBSITE_DEPLOY_DIR}/html"

  mv html "${WEBSITE_DEPLOY_DIR}"

  echo
  echo "Website built and deployed to production. Don't forget to commit any unsaved changes!"
else
  # Start hugo server locally
  hugo serve --ignoreCache --baseURL "http://${LOCAL_MACHINE_IP}:1313" --bind "${LOCAL_MACHINE_IP}"

  echo
  echo "Website deployed locally at http://${LOCAL_MACHINE_IP}:1313"
fi
