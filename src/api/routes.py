"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Provider, Customer, Service, Booking
from api.utils import generate_sitemap, APIException, provider_required, customer_required
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from datetime import datetime, timedelta
from sqlalchemy import func

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
    db.session.flush()

    if role == 'provider':
        provider = Provider(
            user_id=new_user.id,
            name=full_name,
            business_name=data.get('business_name', full_name)
        )
        db.session.add(provider)
    else:
        customer = Customer(
            user_id=new_user.id,
            name=full_name
        )
        db.session.add(customer)

    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201

# Provider Routes

@api.route('/provider/profile', methods=['GET'])
@jwt_required()
@provider_required()
def get_provider_profile():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    provider = Provider.query.filter_by(user_id=user_id).first()
    
    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404
    
    return jsonify(provider.serialize()), 200

@api.route('/provider/profile', methods=['PUT'])
@jwt_required()
@provider_required()
def update_provider_profile():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    provider = Provider.query.filter_by(user_id=user_id).first()
    
    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404
    
    data = request.get_json()
    
    provider.name = data.get('name', provider.name)
    provider.business_name = data.get('businessName', provider.business_name)
    provider.phone = data.get('phone', provider.phone)
    provider.description = data.get('description', provider.description)
    provider.address = data.get('address', provider.address)
    provider.city = data.get('city', provider.city)
    provider.state = data.get('state', provider.state)
    provider.zip_code = data.get('zipCode', provider.zip_code)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'provider': provider.serialize()
    }), 200

@api.route('/provider/services', methods=['GET'])
@jwt_required()
@provider_required()
def get_provider_services():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    provider = Provider.query.filter_by(user_id=user_id).first()
    
    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404
    
    services = Service.query.filter_by(provider_id=provider.id).all()
    
    return jsonify([service.serialize() for service in services]), 200

@api.route('/provider/services', methods=['POST'])
@jwt_required()
@provider_required()
def create_service():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    provider = Provider.query.filter_by(user_id=user_id).first()
    
    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404
    
    data = request.get_json()
    
    required_fields = ['name', 'category', 'price']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'{field} is required'}), 400
 
    valid_categories = ['pets', 'beauty', 'vehicles', 'home']
    if data['category'] not in valid_categories:
        return jsonify({'message': 'Invalid category'}), 400
    
    new_service = Service(
        provider_id=provider.id,
        name=data['name'],
        description=data.get('description', ''),
        category=data['category'],
        price=data['price'],
        duration=data.get('duration'),
        is_active=data.get('isActive', True)
    )
    
    db.session.add(new_service)
    db.session.commit()
    
    return jsonify({
        'message': 'Service created successfully',
        'service': new_service.serialize()
    }), 201

@api.route('/provider/services/<int:service_id>', methods=['PUT'])
@jwt_required()
@provider_required()
def update_service(service_id):
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    provider = Provider.query.filter_by(user_id=user_id).first()
    
    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404
    
    service = Service.query.filter_by(id=service_id, provider_id=provider.id).first()
    
    if not service:
        return jsonify({'message': 'Service not found'}), 404
    
    data = request.get_json()
    
    service.name = data.get('name', service.name)
    service.description = data.get('description', service.description)
    service.category = data.get('category', service.category)
    service.price = data.get('price', service.price)
    service.duration = data.get('duration', service.duration)
    service.is_active = data.get('isActive', service.is_active)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Service updated successfully',
        'service': service.serialize()
    }), 200

@api.route('/provider/services/<int:service_id>', methods=['DELETE'])
@jwt_required()
@provider_required()
def delete_service(service_id):
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    provider = Provider.query.filter_by(user_id=user_id).first()
    
    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404
    
    service = Service.query.filter_by(id=service_id, provider_id=provider.id).first()
    
    if not service:
        return jsonify({'message': 'Service not found'}), 404
    
    db.session.delete(service)
    db.session.commit()
    
    return jsonify({'message': 'Service deleted successfully'}), 200

@api.route('/provider/bookings', methods=['GET'])
@jwt_required()
@provider_required()
def get_provider_bookings():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    provider = Provider.query.filter_by(user_id=user_id).first()
    
    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404
    
    status = request.args.get('status')
    query = Booking.query.filter_by(provider_id=provider.id)
    
    if status:
        query = query.filter_by(status=status)
    
    bookings = query.order_by(Booking.booking_date.desc(), Booking.booking_time.desc()).all()
    
    return jsonify([booking.serialize() for booking in bookings]), 200

@api.route('/provider/bookings/<int:booking_id>', methods=['GET'])
@jwt_required()
@provider_required()
def get_booking_details(booking_id):
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    provider = Provider.query.filter_by(user_id=user_id).first()
    
    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404
    
    booking = Booking.query.filter_by(id=booking_id, provider_id=provider.id).first()
    
    if not booking:
        return jsonify({'message': 'Booking not found'}), 404
    
    return jsonify(booking.serialize()), 200

@api.route('/provider/bookings/<int:booking_id>/status', methods=['PUT'])
@jwt_required()
@provider_required()
def update_booking_status(booking_id):
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    provider = Provider.query.filter_by(user_id=user_id).first()
    
    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404
    
    booking = Booking.query.filter_by(id=booking_id, provider_id=provider.id).first()
    
    if not booking:
        return jsonify({'message': 'Booking not found'}), 404
    
    data = request.get_json()
    new_status = data.get('status')
    
    valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled']
    if new_status not in valid_statuses:
        return jsonify({'message': 'Invalid status'}), 400
    
    booking.status = new_status
    booking.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    return jsonify({
        'message': 'Booking status updated successfully',
        'booking': booking.serialize()
    }), 200

@api.route('/provider/earnings', methods=['GET'])
@jwt_required()
@provider_required()
def get_earnings():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    provider = Provider.query.filter_by(user_id=user_id).first()
    
    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404
    
    today = datetime.utcnow().date()
    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)
    
    today_earnings = db.session.query(func.sum(Booking.total_price)).filter(
        Booking.provider_id == provider.id,
        Booking.status == 'completed',
        Booking.booking_date == today
    ).scalar() or 0.0
    
    week_earnings = db.session.query(func.sum(Booking.total_price)).filter(
        Booking.provider_id == provider.id,
        Booking.status == 'completed',
        Booking.booking_date >= week_start
    ).scalar() or 0.0
    
    month_earnings = db.session.query(func.sum(Booking.total_price)).filter(
        Booking.provider_id == provider.id,
        Booking.status == 'completed',
        Booking.booking_date >= month_start
    ).scalar() or 0.0
    
    total_earnings = db.session.query(func.sum(Booking.total_price)).filter(
        Booking.provider_id == provider.id,
        Booking.status == 'completed'
    ).scalar() or 0.0
    
    recent_transactions = Booking.query.filter_by(
        provider_id=provider.id,
        status='completed'
    ).order_by(Booking.booking_date.desc()).limit(10).all()
    
    return jsonify({
        'today': today_earnings,
        'week': week_earnings,
        'month': month_earnings,
        'total': total_earnings,
        'recentTransactions': [booking.serialize() for booking in recent_transactions]
    }), 200