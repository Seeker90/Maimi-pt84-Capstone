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

CORS(api)


@api.route("/login", methods=["POST"])
def create_token():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    role = request.json.get("role", None)

    if not username or not password or not role:
        return jsonify({"message": "Username, password, and role are required"}), 400

    user = User.query.filter_by(email=username).first()

    if user is None:
        return jsonify({"message": "Invalid credentials"}), 401
    
    if user.password != password:
        return jsonify({"message": "Invalid credentials"}), 401
    
    if user.role != role:
        return jsonify({"message": f"You are not registered as a {role}"}), 403

    access_token = create_access_token(identity={"id": user.id, "role": user.role})
    
    return jsonify({
        "message": "Login successful", 
        "token": access_token,
        "role": user.role,
        "user_id": user.id
    }), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    
    full_name = data.get('full_name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')


    if not all([full_name, email, password, role]):
        return jsonify({"message": "All fields are required"}), 400

    if role not in ['customer', 'provider']:
        return jsonify({"message": "Role must be 'customer' or 'provider'"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 400

    new_user = User(
        full_name=full_name,
        email=email,
        password=password,
        role=role,
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    user_role = current_user["role"]
    
    return jsonify({
        "message": "Access granted",
        "user_id": user_id,
        "role": user_role
    }), 200