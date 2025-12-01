#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Current directory: $(pwd)"
ls -la

# Build the frontend
echo "Installing npm dependencies..."
npm install
echo "Building frontend..."
npm run build

echo "Build complete. Checking dist folder..."
if [ -d "dist" ]; then
    echo "dist folder exists."
    ls -la dist
else
    echo "dist folder MISSING!"
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt
