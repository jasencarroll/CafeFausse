from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app, resources={r"/api/*": {
    "origins": "http://localhost:8080",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"]
}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://cafefausse:aedj12sda@localhost/cafefausse'
db = SQLAlchemy(app)

TOTAL_TABLES = 30

@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    data = request.get_json()
    time_slot = data.get('timeSlot')
    existing_reservations = Reservations.query.filter_by(time_slot=time_slot).count()

    if existing_reservations >= TOTAL_TABLES:
        return jsonify({'error': 'No tables available at this time'}), 400

    # Step 2: Create the customer
    customer = Customers(
        customer_name=data['customer_name'],
        email_address=data['email_address'],
        phone_number=data['phone_number'],
        newsletter_signup=data['newsletter_signup']
    )
    db.session.add(customer)
    db.session.flush()

    reservation = Reservations(
        customer_id=customer.customer_id,
        time_slot=time_slot,
        number_of_guests=data['number_of_guests']
    )
    db.session.add(reservation)
    db.session.commit()

    return jsonify({'message': 'Reservation confirmed'}), 201

class Customers(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(80))
    number_of_guests = db.Column(db.Integer)
    email_address = db.Column(db.String(100))
    phone_number = db.Column(db.String(80))
    newsletter_signup = db.Column(db.Boolean)

class Reservations(db.Model):
    reservation_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'))
    time_slot = db.Column(db.String(80))
    number_of_guests = db.Column(db.Integer)
    table_number = db.Column(db.Integer)

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
    with app.app_context():
        db.create_all()
    app.run(debug=True)
