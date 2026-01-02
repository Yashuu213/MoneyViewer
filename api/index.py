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
    # Fallback to SQLite in /tmp for Vercel/serverless environments (Non-persistent)
    # Or local development
    db_path = os.path.join('/tmp', 'site.db') 
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

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- API Routes ---

@app.route('/api/init_db')
def init_db():
    db.create_all()
    return jsonify({"message": "Database initialized"})

@app.route('/api/register', methods=['POST'])
def register():
    # Ensure tables exist (quick fix for serverless sqlite ephemeral nature)
    # real production apps should use migration scripts
    if 'sqlite' in app.config['SQLALCHEMY_DATABASE_URI']:
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

@app.route('/api/login', methods=['POST'])
def login():
    if 'sqlite' in app.config['SQLALCHEMY_DATABASE_URI']:
        db.create_all()
        
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()
    
    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify({'message': 'Login successful', 'username': user.username})
    
    return jsonify({'error': 'Invalid credentials'}), 401

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
