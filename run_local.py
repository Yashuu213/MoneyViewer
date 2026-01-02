from api.index import app

if __name__ == '__main__':
    print("Starting Flask server for local development at http://localhost:5000")
    # Debug mode is safe for local dev
    app.run(port=5000, debug=True)
