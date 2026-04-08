import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Vercel setup
# Go up one level from api/ directory to find 'dist'
basedir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dist_folder = os.path.join(basedir, 'dist')
app = Flask(__name__, static_folder=dist_folder)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-this')

# Database Configuration
# Vercel Postgres automatically uses POSTGRES_URL, or DATABASE_URL
database_url = os.environ.get('POSTGRES_URL') or os.environ.get('DATABASE_URL')

if not database_url:
    if os.environ.get('VERCEL'):
        # Vercel filesystem is read-only at runtime except for /tmp
        db_path = os.path.join('/tmp', 'upi.db')
    else:
        # Use a persistent local path in the project directory for local development
        db_path = os.path.join(basedir, 'upi.db') 
    database_url = f'sqlite:///{db_path}'

if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login' # Not actually used for JSON API but required by Flask-Login

# --- Models ---
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    transactions = db.relationship('Transaction', backref='owner', lazy=True)
    debts = db.relationship('Debt', backref='owner', lazy=True)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(20), nullable=False) # 'income' or 'expense'
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Debt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False) # 'lent' or 'borrowed'
    description = db.Column(db.String(200))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class TrainingData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    keyword = db.Column(db.String(100), nullable=False)
    target_type = db.Column(db.String(20), nullable=False) # 'income', 'expense', 'lent', 'borrowed'
    target_category = db.Column(db.String(50))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- API Routes ---

@app.route('/api/init_db')
def init_db():
    db.create_all()
    return jsonify({"message": "Database initialized"})

@app.route('/api/reset_db', methods=['POST'])
def reset_db():
    # Dangerous: clears everything. Use with caution.
    db.drop_all()
    db.create_all()
    return jsonify({"message": "All data cleared. Database reset successfully."})

@app.route('/api/register', methods=['POST'])
def register():
    try:
        # Ensure tables exist (quick fix for serverless environments)
        db.create_all()
            
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        hashed_password = generate_password_hash(password)
        new_user = User(username=username, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        print(f"Error during registration: {str(e)}")
        return jsonify({'error': f"Internal Server Error: {str(e)}"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        # Ensure tables exist (quick fix for serverless environments)
        db.create_all()
        
        data = request.json
        username = data.get('username')
        password = data.get('password')
    
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password_hash, password):
            login_user(user)
            return jsonify({'message': 'Login successful', 'username': user.username})
        
        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Error during login: {str(e)}")
        return jsonify({'error': f"Internal Server Error: {str(e)}"}), 500

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out'})

@app.route('/api/check_auth', methods=['GET'])
def check_auth():
    if current_user.is_authenticated:
        return jsonify({'isAuthenticated': True, 'username': current_user.username})
    return jsonify({'isAuthenticated': False})

@app.route('/api/transactions', methods=['GET', 'POST'])
@login_required
def handle_transactions():
    if request.method == 'GET':
        transactions = Transaction.query.filter_by(user_id=current_user.id).order_by(Transaction.date.desc()).all()
        return jsonify([{
            'id': t.id,
            'amount': t.amount,
            'description': t.description,
            'type': t.type,
            'category': t.category,
            'date': t.date.isoformat()
        } for t in transactions])
    
    elif request.method == 'POST':
        data = request.json
        new_transaction = Transaction(
            amount=data['amount'],
            description=data['description'],
            type=data['type'],
            category=data['category'],
            date=datetime.fromisoformat(data['date'].replace('Z', '+00:00')) if 'date' in data else datetime.utcnow(),
            user_id=current_user.id
        )
        db.session.add(new_transaction)
        db.session.commit()
        return jsonify({'message': 'Transaction added', 'id': new_transaction.id}), 201

@app.route('/api/transactions/<int:id>', methods=['DELETE'])
@login_required
def delete_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    if transaction.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction deleted'})

@app.route('/api/debts', methods=['GET', 'POST'])
@login_required
def handle_debts():
    if request.method == 'GET':
        debts = Debt.query.filter_by(user_id=current_user.id).order_by(Debt.date.desc()).all()
        return jsonify([{
            'id': d.id,
            'amount': d.amount,
            'name': d.name,
            'type': d.type,
            'description': d.description,
            'date': d.date.isoformat()
        } for d in debts])
    
    elif request.method == 'POST':
        data = request.json
        new_debt = Debt(
            amount=data['amount'],
            name=data['name'],
            type=data['type'],
            description=data.get('description', ''),
            date=datetime.fromisoformat(data['date'].replace('Z', '+00:00')) if 'date' in data else datetime.utcnow(),
            user_id=current_user.id
        )
        db.session.add(new_debt)
        db.session.commit()
        return jsonify({'message': 'Debt added', 'id': new_debt.id}), 201

@app.route('/api/debts/<int:id>', methods=['DELETE'])
@login_required
def delete_debt(id):
    debt = Debt.query.get_or_404(id)
    if debt.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(debt)
    db.session.commit()
    return jsonify({'message': 'Debt deleted'})

@app.route('/api/debts/clear/<name>', methods=['DELETE'])
@login_required
def clear_person_debts(name):
    try:
        # Delete all debts where name matches (case-insensitive-ish depending on DB) and user_id matches
        # Using a like or direct match based on how they were saved
        debts_to_delete = Debt.query.filter(
            Debt.user_id == current_user.id,
            Debt.name.ilike(name)
        ).all()
        
        count = len(debts_to_delete)
        for d in debts_to_delete:
            db.session.delete(d)
        
        db.session.commit()
        return jsonify({'message': f'Cleared {count} debt entries for {name}'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# --- AI "Bro-Bot" Parser ---
import re

@app.route('/api/train', methods=['POST'])
@login_required
def train_bot():
    data = request.json
    keyword = data.get('keyword', '').lower().strip()
    target_type = data.get('target_type')
    target_category = data.get('target_category')
    
    if not keyword:
        return jsonify({'error': 'Keyword required'}), 400
        
    # Check if exists, update or create
    entry = TrainingData.query.filter_by(user_id=current_user.id, keyword=keyword).first()
    if entry:
        entry.target_type = target_type
        entry.target_category = target_category
    else:
        entry = TrainingData(
            keyword=keyword,
            target_type=target_type,
            target_category=target_category,
            user_id=current_user.id
        )
        db.session.add(entry)
    
    db.session.commit()
    return jsonify({'message': f'Bot learned: {keyword} -> {target_type}'})

@app.route('/api/vocabulary', methods=['GET'])
@login_required
def get_vocabulary():
    vocab = TrainingData.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        'id': v.id,
        'keyword': v.keyword,
        'target_type': v.target_type,
        'target_category': v.target_category
    } for v in vocab])

@app.route('/api/train/<int:id>', methods=['DELETE'])
@login_required
def delete_vocabulary(id):
    entry = TrainingData.query.get_or_404(id)
    if entry.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(entry)
    db.session.commit()
    return jsonify({'message': 'Rule deleted'})

@app.route('/api/ai_parse', methods=['POST'])
@login_required
def ai_parse():
    data = request.json
    text = data.get('text', '').lower()
    
    # Load user's custom training data
    custom_rules = TrainingData.query.filter_by(user_id=current_user.id).all()
    rules_map = {r.keyword: (r.target_type, r.target_category) for r in custom_rules}
    
    # 1. Split by explicit delimiters
    initial_segments = re.split(r'\s+(?:and|aur|plus)\s+|\s*,\s*', text)
    segments = []

    # 2. Implicit Sub-segmentation (Split by multiple numbers)
    # e.g., "100 pizza 200 burger" -> ["100 pizza", "200 burger"]
    for s in initial_segments:
        nums = list(re.finditer(r'(?<![a-zA-Z])\d+(?![a-zA-Z])', s))
        if len(nums) > 1:
            last_pos = 0
            for i in range(1, len(nums)):
                # Logic: If we see a number like "2024" after an amount, don't split there
                if nums[i].group().startswith('20') and len(nums[i].group()) == 4:
                    continue
                split_pos = nums[i].start()
                segments.append(s[last_pos:split_pos].strip())
                last_pos = split_pos
            segments.append(s[last_pos:].strip())
        else:
            segments.append(s.strip())

    results = []
    
    # --- MASSIVE PRE-TRAINING VOCABULARY ---
    CATEGORIES = {
        'Food': ['pizza', 'khana', 'dinner', 'lunch', 'chai', 'coffee', 'maggi', 'snack', 'restaurant', 'mcd', 'kfc', 'swiggy', 'zomato', 'momos', 'burger'],
        'Transport': ['auto', 'cab', 'uber', 'ola', 'petrol', 'diesel', 'bus', 'train', 'metro', 'parking', 'toll'],
        'Shopping': ['amazon', 'flipkart', 'myntra', 'kapde', 'clothes', 'shoes', 'mall', 'zara', 'h&m', 'groceries', 'sabzi'],
        'Bills': ['recharge', 'wifi', 'rent', 'bijli', 'electricity', 'water', 'gas', 'insurance', 'ott', 'netflix'],
        'Healthcare': ['medicine', 'doctor', 'hospital', 'clinic', 'pharma', 'dawai'],
        'Fun': ['movie', 'club', 'party', 'game', 'gaming', 'drinks', 'beer', 'pub'],
    }
    INCOME_KEYWORDS = ['salary', 'income', 'profit', 'mile', 'mila', 'aaye', 'aai', 'credited', 'deposit', 'bonus', 'received']
    
    for seg in segments:
        seg = seg.strip()
        if not seg: continue
            
        amt_match = re.search(r'(\d+)', seg)
        if not amt_match: continue
        amount = float(amt_match.group(1))
        
        is_debt = False
        is_income = False
        person_name = None
        debt_type = None
        target_category = None
        
        # Clean noise words like 'rs', 'rupee', 'rupees'
        clean_seg = re.sub(r'\b(rs|rupee|rupees)\b', '', seg).strip()
        desc_raw = clean_seg.replace(str(int(amount)), '').strip()
        desc_raw = re.sub(r'\s+', ' ', desc_raw).strip()

        
        # 1. CORE HINGLISH PATTERNS (Highest Priority)
        # "ne ... diya/diye" -> Someone gave me money (amount can be in between)
        if re.search(r'\bne\b.*(?:diya|diye|mila)\b', seg):
            is_debt = True
            debt_type = 'borrowed'
        
        # "ko ... diya/diye" -> I gave someone money
        elif re.search(r'\bko\b.*(?:diya|diye)\b', seg) or re.search(r'\blent\b', seg):
            is_debt = True
            debt_type = 'lent'
        
        # "se liya" -> I took from someone
        elif re.search(r'\bse\b.*\bliya\b', seg) or re.search(r'\bborrowed\b', seg):
            is_debt = True
            debt_type = 'borrowed'

        # "mujhe ... mila/diya" -> I received (no explicit name)
        elif re.search(r'\bmujhe\b.*(?:mila|diya|diye|mile)\b', seg):
            is_income = True

        # 2. EXTRACT PERSON NAME (for any person-related command)
        if is_debt or re.search(r'\b(ne|ko|se)\b', seg):
            words = desc_raw.split()
            stop_words = ['ko', 'ne', 'se', 'liya', 'diya', 'diye', 'aur', 'ke', 'liye', 'expense', 'add', 'lent', 'borrowed', 'mujhe', 'rs', 'rupee', 'rupees']
            potential_names = [w for w in words if w not in stop_words and not w.isdigit()]
            if potential_names:
                person_name = potential_names[0].capitalize()

        # 3. APPLY CUSTOM LEARNING (Override/Refinement - only if core rules didn't match)
        for kw, (t_type, t_cat) in rules_map.items():
            if kw in desc_raw:
                if not is_income and not is_debt:
                    if t_type == 'income': is_income = True
                    elif t_type in ['lent', 'borrowed']: 
                        is_debt = True
                        debt_type = t_type
                target_category = t_cat
                break
        
        # 4. FINAL FALLBACK TO PRE-TRAINED KEYWORDS
        if not is_income and not is_debt:
            if any(kw in seg for kw in INCOME_KEYWORDS):
                is_income = True
            
        # 5. DECISION TREE
        if is_debt and person_name:
            results.append({
                'is_debt': True,
                'amount': amount,
                'name': person_name,
                'type': debt_type,
                'description': f"{person_name} ({seg})"
            })
        elif is_income:
            results.append({
                'is_debt': False,
                'amount': amount,
                'type': 'income',
                'category': target_category or ('Salary/Income' if 'salary' in seg else 'General'),
                'description': desc_raw or 'Income'
            })
        else:
            # Default to expense
            category = target_category or 'Other'
            if not target_category:
                for cat, keywords in CATEGORIES.items():
                    if any(kw in desc_raw for kw in keywords):
                        category = cat
                        break
            
            results.append({
                'is_debt': False,
                'amount': amount,
                'type': 'expense',
                'category': category,
                'description': desc_raw or 'Expense'
            })

    return jsonify(results)

# --- Serve Frontend (Fallback for Local Dev) ---
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path.startswith('api/'):
        return jsonify({'error': 'Not Found'}), 404
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# No app.run() needed for Vercel
if __name__ == '__main__':
    app.run(debug=True, port=5001)
