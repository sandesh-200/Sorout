#!/bin/bash

TARGET="${1:-.}"

tree "$TARGET" \
  -a \
  -I 'node_modules|venv|.venv|__pycache__|*.pyc|.git|dist|build|.vite'sh 