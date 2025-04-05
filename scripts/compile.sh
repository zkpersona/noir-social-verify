#!/bin/bash

EXAMPLES_DIR="examples"

for dir in "$EXAMPLES_DIR"/*/; do
  folder_name=$(basename "$dir")
  echo "Compiling package: $folder_name"
  nargo compile --package="$folder_name"
done
