#!/usr/bin/env bash

# Load environment variables from .env file
if [ -f .env ]; then
  source .env
else
  echo ".env file not found!"
  exit 1
fi

# Load environment variables from .env file
if [ -f .venv/bin/activate ]; then
  source .venv/bin/activate
else
  python3 -m venv .venv
fi
pip install -r requirements.txt

# cd tests || exit
# docker compose up --build -d
# cd ../ || exit

# until docker exec postgres pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" 2>/dev/null; do
#   printf '.'
#   sleep 2
# done

# Run the tests
python3 -m pytest tests

# cd tests || exit
# docker compose down
# cd ../ || exit