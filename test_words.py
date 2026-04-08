import requests

s = requests.Session()
s.post('http://localhost:5001/api/register', json={'username':'testUser','password':'password123'})
s.post('http://localhost:5001/api/login', json={'username':'testUser','password':'password123'})

def test_parse(text):
    print(f"\n--- Output for '{text}' ---")
    r = s.post('http://localhost:5001/api/ai_parse', json={'text': text})
    items = r.json() if r.json() else []
    for d in items:
        debt = d.get('is_debt', False)
        tp = d.get('type', '?')
        cat = d.get('category', '')
        name = d.get('name', '')
        amt = d.get('amount', '')
        desc = d.get('description', '')
        print(f"[{amt}] {desc} (Type: {tp}, Category: {cat}, Debt: {debt}, Person: {name})")

test_parse("so pizza")
test_parse("hundred rupees burger")
test_parse("do so petrol")
test_parse("ek hazar rent")
test_parse("pachas chai bees paani")
