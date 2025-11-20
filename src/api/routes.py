"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route("/login", methods=["POST"])
def create_token():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email = username, password = password).first()

    if user is None:
        return jsonify({"msg": "Bad username or password"}), 401


    access_token = create_access_token(identity=user.id)
    return jsonify({"msg": "successful", "token": access_token})



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

