#!/bin/python3

import os
import shlex
import sys

font_file = sys.argv[1]

# Create a set to store the characters
char_set = set()

# Function to check if a file is binary
def is_binary(file_path):
    try:
        with open(file_path, 'rb') as f:
            while True:
                chunk = f.read(1024)
                if b'\x00' in chunk:  # Binary files often contain null bytes
                    return True
                if not chunk:
                    break
    except Exception:
        pass
    return False

# Iterate through the directory names and file contents
for root, dirs, files in os.walk("."):

    # Add directory names to charset
    for dir_name in dirs:
        char_set.update(dir_name)

    # Add filenames to charset
    for file_name in files:
        file_path = os.path.join(root, file_name)

        # If the file is not binary data, add file contents to charset
        if not is_binary(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    char_set.update(content)
            except Exception as e:
                pass

# Print the deduplicated list of characters
deduplicated_chars = shlex.quote("".join(sorted(list(char_set))))

# Create woff2 subset of font characters. Only use characters present in the website.
os.system(f"mkdir -p ./static/fonts/")
os.system(f"pyftsubset ./{font_file} --output-file=static/fonts/font.ttf --text={deduplicated_chars}")
os.system("woff2_compress static/fonts/font.ttf")
os.system("rm static/fonts/font.ttf")
