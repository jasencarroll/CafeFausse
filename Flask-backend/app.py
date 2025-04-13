from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://cafefausse:aedj12sda@localhost/cafefausse'
db = SQLAlchemy(app)

class Customers(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(80))
    email_address = db.Column(db.String(80))
    phone_number = db.Column(db.String(80))
    newsletter_signup = db.Column(db.Boolean)

class Reservations(db.Model):
    reservation_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer)
    time_slot = db.Column(db.Time)
    table_number = db.Column(db.Integer)

# Enable CORS for all routes with explicit origins
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080"]}})

@app.route("/api/health", methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route("/api/menu", methods=['GET'])
def menu():
    # Example data - you would typically fetch this from a database
    menu_items = [
        {"id": 1, "name": "Bruschetta", "price": 8.50, "category": "Starters", "description": "Fresh tomatoes, basil, olive oil, and toasted baguette slices"},
        {"id": 2, "name": "Caesar Salad", "price": 9.00, "category": "Starters", "description": "Crisp romaine with homemade Caesar dressing"},
        {"id": 3, "name": "Grilled Salmon", "price": 22.00, "category": "Main Courses", "description": "Served with lemon butter sauce and seasonal vegetables"},
        {"id": 4, "name": "Ribeye Steak", "price": 28.00, "category": "Main Courses", "description": "12 oz prime cut with garlic mashed potatoes"},
        {"id": 5, "name": "Vegetable Risotto", "price": 18.00, "category": "Main Courses", "description": "Creamy Arborio rice with wild mushrooms"},
        {"id": 6, "name": "Tiramisu", "price": 7.50, "category": "Desserts", "description": "Classic Italian dessert with mascarpone"},
        {"id": 7, "name": "Cheesecake", "price": 7.00, "category": "Desserts", "description": "Creamy cheesecake with berry compote"},
        {"id": 8, "name": "Red Wine (Glass)", "price": 10.00, "category": "Beverages", "description": "A selection of Italian reds"},
        {"id": 9, "name": "White Wine (Glass)", "price": 9.00, "category": "Beverages", "description": "Crisp and refreshing"},
        {"id": 10, "name": "Craft Beer", "price": 6.00, "category": "Beverages", "description": "Local artisan brews"},
        {"id": 11, "name": "Espresso", "price": 3.00, "category": "Beverages", "description": "Strong and aromatic"}
    ]
    return jsonify(menu_items)

if __name__ == "__main__":
    app.run(debug=True)
    with app.app_context():
        db.create_all()
