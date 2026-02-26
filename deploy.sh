#!/usr/bin/env bash

# Initialize environment
WORKING_DIR=$(dirname "$(realpath "$0")")
source ${WORKING_DIR}/.env
cd "${WORKING_DIR}"

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



# Create a subset of font containing all characters present in website
python3 ./get-all-chars.py space.ttf

# Move .wget-hsts from home dir to cache dir
temp_wgetrc=$(mktemp)
echo "hsts-file=${XDG_CACHE_HOME:-${HOME}/.local/cache}/wget-hsts" > temp_wgetrc
export WGETRC="${temp_wgetrc}"

# Download resume PDF
wget "${RESUME_PDF_URL}" -O "resume.pdf"
# Convert from PDF to JPEG
pdftoppm -jpeg -f 1 -singlefile resume.pdf resume
# Convert from JPEG to WEBP
cwebp "resume.jpg" -o "static/images/resume.webp" -q 100
# Remove temp PDF and JPEG files
rm "resume.jpg"
rm $(basename "${RESUME_PDF_URL}")

# Sync music listening progress metadata
python3 ./website-listening-progress-json.py

if [ "$1" == "test" ]; then
  # Start hugo server locally
  hugo serve --ignoreCache --baseURL "http://${LOCAL_MACHINE_IP}:1313" --bind "${LOCAL_MACHINE_IP}"

  echo
  echo "Website deployed locally at http://${LOCAL_MACHINE_IP}:1313"
else
  # Generate and deploy to server
  hugo

  mv public/ html/

  rm -r "${WEBSITE_DEPLOY_DIR}/html"

  mv html "${WEBSITE_DEPLOY_DIR}"

  echo
  echo "Website built and deployed to production. Don't forget to commit any unsaved changes!"
fi
