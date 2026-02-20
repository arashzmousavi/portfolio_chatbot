#!/bin/sh

# بارگذاری .env
export $(grep -v '^#' .env | xargs)

# Inject env متغیرهای NEXT_PUBLIC به window.env
echo "window.env = {
  BASE_URL: '${NEXT_PUBLIC_BASE_URL}',
};" > /app/public/env.js

# Start Next.js
npm start
