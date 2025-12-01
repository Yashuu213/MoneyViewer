from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='dist', static_url_path='')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print("Starting Flask server at http://localhost:5000")
    app.run(use_reloader=True, port=5000, threaded=True)
