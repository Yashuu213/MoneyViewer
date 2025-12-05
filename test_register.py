import requests
import json

url = 'http://localhost:5000/api/register'
headers = {'Content-Type': 'application/json'}
data = {
    'username': 'testuser_debug',
    'password': 'password123'
}

try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error connecting to server: {e}")
