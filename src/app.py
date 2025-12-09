"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
app = Flask(__name__)
app.url_map.strict_slashes = False

# ============================================
# Configure CORS for frontend requests
# ============================================
allowed_origins = [
    "http://localhost:5173",      # Local Vite dev
    "http://localhost:3000",       # Local alternative port
    "http://localhost:3001",       # Local Flask port
    "https://maimi-pt84-capstone-production.up.railway.app",  # Production frontend
]

# Add production frontend URL if set in environment
if os.getenv("FRONTEND_URL"):
    allowed_origins.append(os.getenv("FRONTEND_URL"))

if ENV == "production":
    # In production, only allow specified origins
    CORS(app, origins=allowed_origins, supports_credentials=True)
else:
    # In development, allow all origins
    CORS(app)

jwt_secret = os.environ.get('JWT_SECRET_KEY') or os.environ.get('FLASK_SECRET')
if not jwt_secret:
    if ENV == "production":
        raise ValueError(
            "JWT_SECRET_KEY environment variable is not set. "
            "This is required for authentication. Set it in Railway Variables."
        )
    else:
        # In development, use a default key but warn the user
        print("⚠️  Warning: JWT_SECRET_KEY not set. Using insecure default for development only.")
        jwt_secret = "dev-secret-key-change-in-production"

app.config["JWT_SECRET_KEY"] = jwt_secret
jwt = JWTManager(app)

db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

setup_admin(app)
setup_commands(app)

app.register_blueprint(api, url_prefix='/api')


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code


@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Backend is running",
        "environment": ENV
    }), 200


@app.route('/', methods=['GET'])
def root():
    """Root endpoint - returns API info"""
    if ENV == "development":
        return generate_sitemap(app)
    else:
        # In production, return API info instead of sitemap
        return jsonify({
            "message": "HomeCalls Backend API",
            "version": "1.0.0",
            "docs": "https://backend-production-eafd.up.railway.app/api/swagger",
            "status": "running"
        }), 200


if __name__ == '__main__':
    # Railway uses PORT 8080 by default
    # Local development uses 3001
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=ENV == "development")
