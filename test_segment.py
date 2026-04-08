import requests, json

s = requests.Session()
s.post('http://localhost:5001/api/register', json={'username':'finaltest12','password':'finaltest12'})
s.post('http://localhost:5001/api/login', json={'username':'finaltest12','password':'finaltest12'})

def test(text):
    r = s.post('http://localhost:5001/api/ai_parse', json={'text': text})
    items = r.json() if r.json() else []
    output = []
    for d in items:
        debt = d.get('is_debt', False)
        tp = d.get('type', '?')
        cat = d.get('category', '')
        name = d.get('name', '')
        amt = d.get('amount', '')
        desc = d.get('description', '')
        output.append(f"[{amt}] {desc} (debt={debt} type={tp} cat={cat} name={name})")
    return "\n    ".join(output)

print("1: " + test('100 pizza 200 burger'))
print("2: " + test('Rs 100 Pizza 200 rupees Barger'))
print("3: " + test('Rahul ko 500 rent aur 200 petrol'))
