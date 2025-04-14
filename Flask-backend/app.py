from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random # For assignment of a customer's reservation to a random table number of 1 to 30

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080"]}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://cafefausse:aedj12sda@localhost/cafefausse'
db = SQLAlchemy(app)

TOTAL_TABLES = 30

@app.route("/")
def home():
    return "Flask is operational."

@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    data = request.get_json() # Save the JSON data posted from reservation.jsx into the Python dictionary 'data'
    time_slot = data.get('timeSlot') # In the Python dictionary 'data', for the key 'timeSlot', get the value (a string) and assign it to the variable 'time_slot'

    # Step 1: Check table availability
    reserved_tables = db.session.query(Reservations.table_number).filter_by(time_slot=time_slot).all() # Get all of the table numbers that are already reserved for the given time slot
    reserved_table_numbers = {t[0] for t in reserved_tables if t[0] is not None} # Convert the list of tuples in reserved_tables into a set of table numbers
    all_table_numbers = set(range(1, TOTAL_TABLES + 1)) # Create a set of all table numbers from 1 to TOTAL_TABLES (30)
    available_tables = list(all_table_numbers - reserved_table_numbers) # Get the list of available table numbers by subtracting the reserved table numbers from the total table numbers
    if not available_tables:
        return jsonify({
            'status': 'error',
            'message': 'No tables available for this time. Please choose a different date and time.'
        }), 200 # HTTP code 200 indicates that the request was successfully received, understood, and processed by the server, even though the reservation could not be made.

    # Step 2: Assign a random available table
    assigned_table = random.choice(available_tables)

    # Step 3: Check if the customer's email already exists in the database.
    # If the customer's email address already exists, then the existing customer record is retrieved
    # If the customer's email address does not exist, then None will be returned
    customer = Customers.query.filter_by(email_address=data['email_address']).first()
    
    if not customer:
        # Since the customer is making a reservation for the first time, create a new customer record
        customer = Customers(
            customer_name=data['customer_name'],
            email_address=data['email_address'],
            phone_number=data['phone_number'],
            newsletter_signup=data['newsletter_signup']
        )
        db.session.add(customer) # Tells SQLAlchemy to stage the new customer object for insertion into the database
        db.session.flush() # Forces SQLAlchemy to insert the customer into the database immediately as this is necessary to get the
                           # customer_id for the reservation. Ensures the auto-generated customer.customer_id (primary key) is
                           # available before you create the reservation record that references it.

    # Step 4: Create a reservation for that customer
    reservation = Reservations(
        customer_id=customer.customer_id,
        time_slot=time_slot,
        number_of_guests=data['number_of_guests']
    )
    db.session.add(reservation)
    db.session.commit() # The records for customer and reservation are officially saved into the PostgreSQL database

    return jsonify({'message': 'Reservation confirmed','table_number': assigned_table}), 201
    # HTTP code 201 indicates that the request has been fulfilled and has resulted in the creation of a new resource.

class Customers(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(80))
    email_address = db.Column(db.String(100))
    phone_number = db.Column(db.String(80))
    newsletter_signup = db.Column(db.Boolean)

class Reservations(db.Model):
    reservation_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('Customers.customer_id'))
    time_slot = db.Column(db.DateTime)
    number_of_guests = db.Column(db.Integer)
    table_number = db.Column(db.Integer)
    # For a given customer, the number of guests could vary by reservation, so number_of_guests is
    # included in the Reservations table, not in the Customers table

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
        db.create_all() # Create the database tables 'Customers' and 'Reservations'
    app.run(debug=True) # Ensures that the server starts and reloads itself when you save changes during development
