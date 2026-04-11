import subprocess
import os
import sys
from api.index import app

if __name__ == '__main__':
    print("Building the frontend (Vite)... please wait.")
    # Run npm build to ensure 'dist' folder is up to date with 'src'
    try:
        if os.path.exists('package.json'):
            subprocess.run(["npm", "run", "build"], shell=True, check=True)
        else:
            print("Warning: package.json not found. Skipping build step.")
    except Exception as e:
        print(f"Error during build: {e}")
        print("Starting server anyway...")

    print("\nStarting Hisaab.AI Flask server at http://127.0.0.1:5001")
    # Using port 5001 to match vite.config.js proxy settings
    app.run(port=5001, debug=True)
