from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, Provider, Customer, Service, Booking
from api.utils import (
    generate_sitemap,
    APIException,
    provider_required,
    customer_required
)
from flask_cors import CORS
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required
)
from datetime import datetime, timedelta
from sqlalchemy import func
from math import radians, cos, sin, asin, sqrt
from api.sms_service import sms_service

api = Blueprint("api", __name__)
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

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "role": user.role,
        "user_id": user.id
    }), 200


@api.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}

    required = ["full_name", "email", "password", "role"]
    if not all(data.get(key) for key in required):
        return jsonify({"message": "All fields are required"}), 400

    role = data["role"]
    if role not in ["customer", "provider"]:
        return jsonify({"message": "Role must be 'customer' or 'provider'"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 400

    new_user = User(
        full_name=data["full_name"],
        email=data["email"],
        password=data["password"],
        role=role,
        is_active=True
    )

    db.session.add(new_user)
    db.session.flush()

    if role == "provider":
        db.session.add(Provider(
            user_id=new_user.id,
            name=new_user.full_name,
            business_name=data.get("business_name", new_user.full_name)
        ))
    else:
        db.session.add(Customer(
            user_id=new_user.id,
            name=new_user.full_name
        ))

    db.session.commit()

    return jsonify({"message": "User created successfully!"}), 201


def get_current_provider():
    user_id_str = get_jwt_identity()
    user_id = int(user_id_str)
    provider = Provider.query.filter_by(user_id=user_id).first()

    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404

    return provider


@api.route('/provider/profile', methods=['GET'])
@jwt_required()
@provider_required()
def get_provider_profile():
    user_id_str = get_jwt_identity()
    user_id = int(user_id_str)
    provider = Provider.query.filter_by(user_id=user_id).first()

    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404

    return jsonify(provider.serialize()), 200


@api.route("/provider/profile", methods=["PUT"])
@jwt_required()
@provider_required()
def update_provider_profile():
    provider = get_current_provider()
    if not provider:
        return jsonify({"message": "Provider profile not found"}), 404

    data = request.get_json() or {}

    provider.name = data.get("name", provider.name)
    provider.business_name = data.get("businessName", provider.business_name)
    provider.phone = data.get("phone", provider.phone)
    provider.description = data.get("description", provider.description)
    provider.address = data.get("address", provider.address)
    provider.city = data.get("city", provider.city)
    provider.state = data.get("state", provider.state)
    provider.zip_code = data.get("zipCode", provider.zip_code)

    db.session.commit()

    return jsonify({
        "message": "Profile updated successfully",
        "provider": provider.serialize()
    }), 200


@api.route('/provider/location', methods=['PUT'])
@jwt_required()
@provider_required()
def update_provider_location():
    user_id_str = get_jwt_identity()
    user_id = int(user_id_str)
    provider = Provider.query.filter_by(user_id=user_id).first()

    if not provider:
        return jsonify({'message': 'Provider profile not found'}), 404

    data = request.get_json()

    if 'latitude' in data and 'longitude' in data:
        provider.latitude = data['latitude']
        provider.longitude = data['longitude']
    if 'address' in data:
        provider.address = data['address']
    if 'city' in data:
        provider.city = data['city']
    if 'state' in data:
        provider.state = data['state']
    if 'zipCode' in data:
        provider.zip_code = data['zipCode']

    db.session.commit()

    return jsonify({
        'message': 'Location updated successfully',
        'provider': provider.serialize()
    }), 200


@api.route("/provider/services", methods=["GET"])
@jwt_required()
@provider_required()
def get_provider_services():
    provider = get_current_provider()
    if not provider:
        return jsonify({"message": "Provider profile not found"}), 404

    services = Service.query.filter_by(provider_id=provider.id).all()
    return jsonify([s.serialize() for s in services]), 200


@api.route('/provider/services', methods=['POST'])
@jwt_required()
@provider_required()
def create_service():
    user_id_str = get_jwt_identity()
    user_id = int(user_id_str)
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


@api.route("/provider/services/<int:service_id>", methods=["PUT"])
@jwt_required()
@provider_required()
def update_service(service_id):
    provider = get_current_provider()
    if not provider:
        return jsonify({"message": "Provider profile not found"}), 404

    service = Service.query.filter_by(
        id=service_id, provider_id=provider.id).first()
    if not service:
        return jsonify({"message": "Service not found"}), 404

    data = request.get_json() or {}

    for field in ["name", "description", "category", "price", "duration", "is_active"]:
        if field in data:
            setattr(service, field, data[field])

    db.session.commit()

    return jsonify({
        "message": "Service updated successfully",
        "service": service.serialize()
    }), 200


@api.route("/provider/services/<int:service_id>", methods=["DELETE"])
@jwt_required()
@provider_required()
def delete_service(service_id):
    provider = get_current_provider()
    if not provider:
        return jsonify({"message": "Provider profile not found"}), 404

    service = Service.query.filter_by(
        id=service_id, provider_id=provider.id).first()
    if not service:
        return jsonify({"message": "Service not found"}), 404

    db.session.delete(service)
    db.session.commit()

    return jsonify({"message": "Service deleted successfully"}), 200


@api.route("/provider/bookings", methods=["GET"])
@jwt_required()
@provider_required()
def get_provider_bookings():
    provider = get_current_provider()
    if not provider:
        return jsonify({"message": "Provider profile not found"}), 404

    status = request.args.get("status")
    query = Booking.query.filter_by(provider_id=provider.id)

    if status:
        query = query.filter_by(status=status)

    bookings = query.order_by(
        Booking.booking_date.desc(),
        Booking.booking_time.desc()
    ).all()

    return jsonify([b.serialize() for b in bookings]), 200

@api.route("/customer/bookings", methods=["GET"])
@jwt_required()
@customer_required()
def get_customer_bookings():
    """
    Get all bookings for the logged-in customer with service and provider details
    """
    user_id_str = get_jwt_identity()
    user_id = int(user_id_str)
    
    customer = Customer.query.filter_by(user_id=user_id).first()
    if not customer:
        return jsonify({'message': 'Customer profile not found'}), 404
    
    bookings = Booking.query.filter_by(customer_id=customer.id).order_by(
        Booking.booking_date.desc(),
        Booking.booking_time.desc()
    ).all()
    
    bookings_data = []
    for booking in bookings:
        service = booking.service
        provider = booking.provider
        
        if booking.booking_date and booking.booking_time:
            service_datetime = f"{booking.booking_date.isoformat()}T{booking.booking_time.isoformat()}"
        else:
            service_datetime = ""
        
        booking_data = {
            'id': booking.id,
            'serviceType': service.category if service else 'Unknown',
            'providerName': provider.name if provider else 'Unknown',
            'description': service.description if service else '',
            'serviceDate': service_datetime,
            'price': float(service.price) if service else 0,
            'duration': float(service.duration) if service and service.duration else 0,
            'status': booking.status,
            'rating': None
        }
        bookings_data.append(booking_data)
    
    return jsonify(bookings_data), 200

@api.route("/provider/bookings/<int:booking_id>", methods=["GET"])
@jwt_required()
@provider_required()
def get_booking_details(booking_id):
    provider = get_current_provider()
    if not provider:
        return jsonify({"message": "Provider profile not found"}), 404

    booking = Booking.query.filter_by(
        id=booking_id, provider_id=provider.id).first()
    if not booking:
        return jsonify({"message": "Booking not found"}), 404

    return jsonify(booking.serialize()), 200


@api.route("/provider/bookings/<int:booking_id>/status", methods=["PUT"])
@jwt_required()
@provider_required()
def update_booking_status(booking_id):
    provider = get_current_provider()
    if not provider:
        return jsonify({"message": "Provider profile not found"}), 404

    booking = Booking.query.filter_by(
        id=booking_id, provider_id=provider.id).first()
    if not booking:
        return jsonify({"message": "Booking not found"}), 404

    data = request.get_json() or {}
    status = data.get("status")

    if status not in ["pending", "confirmed", "completed", "cancelled"]:
        return jsonify({"message": "Invalid status"}), 400

    booking.status = status
    booking.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify({
        "message": "Booking status updated successfully",
        "booking": booking.serialize()
    }), 200

@api.route("/provider/earnings", methods=["GET"])
@jwt_required()
@provider_required()
def get_earnings():
    provider = get_current_provider()
    if not provider:
        return jsonify({"message": "Provider profile not found"}), 404

    today = datetime.utcnow().date()
    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)

    def sum_for(filter_expr):
        return db.session.query(func.sum(Booking.total_price)).filter(
            Booking.provider_id == provider.id,
            Booking.status == "completed",
            *filter_expr
        ).scalar() or 0.0

    earnings_today = sum_for([Booking.booking_date == today])
    earnings_week = sum_for([Booking.booking_date >= week_start])
    earnings_month = sum_for([Booking.booking_date >= month_start])
    earnings_total = sum_for([])

    recent = Booking.query.filter_by(
        provider_id=provider.id, status="completed"
    ).order_by(Booking.booking_date.desc()).limit(10)

    return jsonify({
        "today": earnings_today,
        "week": earnings_week,
        "month": earnings_month,
        "total": earnings_total,
        "recentTransactions": [b.serialize() for b in recent]
    }), 200


@api.route('/services', methods=['GET'])
def get_all_services():
    category = request.args.get('category')

    query = Service.query.filter_by(is_active=True)

    if category:
        query = query.filter_by(category=category)

    services = query.all()

    results = []
    for service in services:
        service_data = service.serialize()
        service_data['provider'] = {
            'id': service.provider.id,
            'name': service.provider.name,
            'businessName': service.provider.business_name,
            'phone': service.provider.phone,
            'email': service.provider.user.email,
            'city': service.provider.city,
            'state': service.provider.state,
            'rating': service.provider.rating
        }
        results.append(service_data)

    return jsonify(results), 200


@api.route('/providers/<int:provider_id>', methods=['GET'])
def get_provider_details(provider_id):
    provider = Provider.query.get(provider_id)

    if not provider:
        return jsonify({'message': 'Provider not found'}), 404

    return jsonify(provider.serialize()), 200


@api.route('/providers/<int:provider_id>/services', methods=['GET'])
def get_provider_services_public(provider_id):
    provider = Provider.query.get(provider_id)

    if not provider:
        return jsonify({'message': 'Provider not found'}), 404

    services = Service.query.filter_by(
        provider_id=provider_id, is_active=True).all()

    return jsonify([service.serialize() for service in services]), 200


def haversine_distance(lat1, lon1, lat2, lon2):
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))

    r = 3956

    return c * r


@api.route('/services/nearby', methods=['GET'])
def get_nearby_services():

    try:
        user_lat = float(request.args.get('lat'))
        user_lon = float(request.args.get('lon'))
    except (TypeError, ValueError):
        return jsonify({'message': 'Valid latitude and longitude required'}), 400

    radius = float(request.args.get('radius', 25))
    category = request.args.get('category')

    query = Service.query.filter_by(is_active=True)

    if category:
        query = query.filter_by(category=category)

    services = query.all()

    nearby_services = []
    for service in services:
        provider = service.provider

        if not provider.latitude or not provider.longitude:
            continue

        distance = haversine_distance(
            user_lat, user_lon,
            provider.latitude, provider.longitude
        )

        if distance <= radius:
            service_data = service.serialize()
            service_data['provider'] = {
                'id': provider.id,
                'name': provider.name,
                'businessName': provider.business_name,
                'phone': provider.phone,
                'email': provider.user.email,
                'city': provider.city,
                'state': provider.state,
                'rating': provider.rating,
                'distance': round(distance, 1)
            }
            nearby_services.append(service_data)

    nearby_services.sort(key=lambda x: x['provider']['distance'])

    return jsonify(nearby_services), 200


@api.route('/bookings', methods=['POST'])
@jwt_required()
@customer_required()
def create_booking():
    """
    Create a new booking and send SMS notifications via Twilio
    """
    user_id_str = get_jwt_identity()
    user_id = int(user_id_str)

    customer = Customer.query.filter_by(user_id=user_id).first()
    if not customer:
        return jsonify({'message': 'Customer profile not found'}), 404

    data = request.get_json() or {}

    # Validate required fields
    required_fields = ['service_id']
    if not all(data.get(field) for field in required_fields):
        return jsonify({'message': 'Service ID is required'}), 400

    service = Service.query.get(data['service_id'])
    if not service:
        return jsonify({'message': 'Service not found'}), 404

    provider = service.provider

    new_booking = Booking(
        customer_id=customer.id,
        provider_id=provider.id,
        service_id=service.id,
        booking_date=datetime.utcnow().date(),
        booking_time=datetime.utcnow().time(),
        status='pending',
        total_price=service.price
    )

    db.session.add(new_booking)
    db.session.flush()

    try:
        if customer.phone:
            sms_service.send_booking_confirmation_to_customer(
                customer.phone,
                provider.name,
                provider.phone or 'Not provided',
                provider.user.email
            )

        if provider.phone:
            sms_service.send_booking_notification_to_provider(
                provider.phone,
                customer.name,
                customer.address or 'Not provided',
                service.name
            )

        db.session.commit()

        return jsonify({
            'message': 'Booking created successfully and SMS notifications sent',
            'booking': new_booking.serialize()
        }), 201

    except ValueError as e:
        db.session.rollback()
        print(f"SMS Error: {str(e)}")
        db.session.add(new_booking)
        db.session.commit()

        return jsonify({
            'message': 'Booking created but SMS notification failed',
            'booking': new_booking.serialize(),
            'sms_error': str(e)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error creating booking: {str(e)}'}), 500
    

@api.route('/bookings/recent', methods=['GET'])
@jwt_required()
def get_recent_bookings():
    user_id = get_jwt_identity()
    category = request.args.get('category', None)
    
    query = Booking.query.filter_by(customer_id=user_id)
    
    if category:
        query = query.join(Service).filter(Service.category == category)
    
    bookings = query.order_by(Booking.created_at.desc()).limit(10).all()
    
    result = []
    for b in bookings:
        result.append({
            'id': b.id,
            'serviceId': b.service_id,
            'serviceName': b.service.name,
            'category': b.service.category,
            'providerName': b.service.provider.business_name or b.service.provider.name,
            'providerCity': b.service.provider.city,
            'date': b.created_at.isoformat(),
            'price': float(b.service.price),
            'status': b.status
        })
    
    return jsonify(result), 200
# Add this route to your Flask api.py file

@api.route("/customer/profile", methods=["GET", "PUT"])
@jwt_required()
@customer_required()
def customer_profile():
    """
    Get or update customer profile information (fullName, phone, address)
    """
    user_id_str = get_jwt_identity()
    user_id = int(user_id_str)
    
    customer = Customer.query.filter_by(user_id=user_id).first()
    if not customer:
        return jsonify({'message': 'Customer profile not found'}), 404
    
    if request.method == 'GET':
        return jsonify({
            'fullName': customer.name,
            'phone': customer.phone,
            'address': customer.address
        }), 200
    
    elif request.method == 'PUT':
        data = request.get_json() or {}
        
        customer.name = data.get('fullName', customer.name)
        customer.phone = data.get('phone', customer.phone)
        customer.address = data.get('address', customer.address)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'fullName': customer.name,
            'phone': customer.phone,
            'address': customer.address
        }), 200