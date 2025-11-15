"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    full_name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    # check if email exists
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400

    # create user
    new_user = User(
        full_name=full_name,
        email=email,
        password=password, 
        role=role,
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully!"}), 200
