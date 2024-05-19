#!/bin/bash

# First, convert all non-JPG to JPG
# PDF to JPG
find ./static/ -type f -name "*.pdf" -print0 | while IFS= read -r -d '' file; do
  filename_no_ext="${file%.*}"

  pdftoppm -jpeg "$file" "$filename_no_ext"
  rm "$file"
done


# Finally, convert all JPG to WebP
find ./static/ -type f -name "*.jpg" -print0 | while IFS= read -r -d '' file; do
  filename_no_ext="${file%.*}"

  cwebp -resize 500 0 "$file" -o "$filename_no_ext.webp" && rm "$file"
done
