from flask import Flask, render_template, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

# Enable CORS for all routes with explicit origins
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8080", "http://127.0.0.1:8080"]}})

@app.route("/api/health", methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route("/api/menu", methods=['GET'])
def menu():
    # Example data - you would typically fetch this from a database
    menu_items = [
        {"id": 1, "name": "Café Latte", "price": 4.50, "category": "Coffee"},
        {"id": 2, "name": "Croissant", "price": 3.25, "category": "Pastries"},
        {"id": 3, "name": "Avocado Toast", "price": 8.75, "category": "Breakfast"}
    ]
    return jsonify(menu_items)

if __name__ == "__main__":
    app.run(debug=True)