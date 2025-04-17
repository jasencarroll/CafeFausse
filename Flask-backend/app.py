# pip install -r requirements.txt

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random # For assignment of a customer's reservation to a random table number of 1 to 30

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080"]}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://cafefausse:aedj12sda@localhost/cafefausse'
db = SQLAlchemy(app)

TOTAL_TABLES = 30

# Define models first, before route handlers
class Customers(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(80))
    email_address = db.Column(db.String(100))
    phone_number = db.Column(db.String(80))
    newsletter_signup = db.Column(db.Boolean)

class Reservations(db.Model):
    reservation_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.customer_id'))
    time_slot = db.Column(db.DateTime)
    number_of_guests = db.Column(db.Integer)
    table_number = db.Column(db.Integer)

# This database will store a list of email addresses of customers who have signed up for the newsletter
class Signup_List(db.Model):
    signup_email_id = db.Column(db.Integer, primary_key=True)
    email_address = db.Column(db.String(100))

# Initialize the database first
with app.app_context():
    db.create_all()

# Then define all your routes
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

    # Check if the customer already has a reservation at the same time
    existing_reservation = Reservations.query.filter_by(customer_id=customer.customer_id, time_slot=time_slot).first()
    if existing_reservation:
        return jsonify({
            'status': 'error',
            'message': 'You already have a reservation at this time.'
        }), 200

    # If the customer checks off that they would like to subscribe to the newsletter, then add their email address into
    # the Signup_List table if it does not already exist
    if customer.newsletter_signup:
        existing_signup = Signup_List.query.filter_by(email_address=customer.email_address).first()
        if not existing_signup:
            new_signup = Signup_List(email_address=customer.email_address)
            db.session.add(new_signup)

    # Step 4: Create a reservation for that customer
    reservation = Reservations(
        customer_id=customer.customer_id,
        time_slot=time_slot,
        number_of_guests=data['number_of_guests'],
        table_number=assigned_table
    )
    db.session.add(reservation)
    db.session.commit() # The records for customer and reservation are officially saved into the PostgreSQL database

    return jsonify({'message': 'Reservation confirmed','table_number': assigned_table}), 201
    # HTTP code 201 indicates that the request has been fulfilled and has resulted in the creation of a new resource.

@app.route("/api/health", methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

# This route handles the newsletter signup
@app.route('/api/newsletter-signup', methods=['POST'])
def newsletter_signup():
    data = request.get_json() # Parses the incoming JSON data from the HTTP request body and returns it as a Python dictionary
    email = data.get('email') # Extracts the email address from the data dictionary
    
    # Check if email already exists in the PostgreSQL table
    existing_signup = Signup_List.query.filter_by(email_address=email).first()
    if existing_signup:
        return jsonify({
            'status': 'error',
            'message': 'This email is already subscribed to the newsletter.'
        }), 200

    # Create new signup
    new_signup = Signup_List(email_address=email)
    db.session.add(new_signup)
    db.session.commit()

    return jsonify({
        'status': 'success',
        'message': 'Successfully subscribed to newsletter.'
    }), 201

@app.route("/api/menu", methods=['GET'])
def menu():
    # Menu data left as a python list instead of SQL db for easy updating
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
    app.run(debug=True) # Ensures that the server starts and reloads itself when you save changes during development
