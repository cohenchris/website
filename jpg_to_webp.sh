#!/bin/bash

find . -type f -name "*.jpg" -print0 | while IFS= read -r -d '' file; do
  filename_no_ext="${file%.*}"

  cwebp -resize 500 0 "$file" -o "$filename_no_ext.webp" && rm "$file"
done
