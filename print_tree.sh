#!/bin/bash

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

tree "$ROOT" \
  -a \
  -I 'node_modules|venv|.venv|__pycache__|*.pyc|.git|dist|build' 