#!/bin/python3.11

import os
import shlex

# Replace 'your_directory_path' with the path to the directory you want to analyze
directory_path = '.'

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
for root, dirs, files in os.walk(directory_path):
    for dir_name in dirs:
        char_set.update(dir_name)
    for file_name in files:
        file_path = os.path.join(root, file_name)
        if not is_binary(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    char_set.update(content)
            except Exception as e:
                pass

# Print the deduplicated list of characters
deduplicated_chars = shlex.quote("".join(sorted(list(char_set))))

os.system(f"pyftsubset terminus.ttf --output-file=static/fonts/terminus.ttf --text={deduplicated_chars}")
os.system("woff2_compress static/fonts/terminus.ttf")
os.system("rm static/fonts/terminus.ttf")
