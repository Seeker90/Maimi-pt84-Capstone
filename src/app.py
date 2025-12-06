"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
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

# Configure to serve React build from dist/
app.static_folder = os.path.join(os.path.dirname(__file__), '../dist')
app.static_url_path = ''

app.url_map.strict_slashes = False

# ============================================
# Configure CORS for frontend requests
# ============================================
allowed_origins = [
    "http://localhost:5173",      # Local Vite dev
    "http://localhost:3000",       # Local alternative port
    "http://localhost:3001",       # Local Flask port
    "http://localhost:8000",       # Local Flask gunicorn
    "https://full-stack-production-5ab7.up.railway.app",  # Production Railway
    "https://maimi-pt84-capstone-production.up.railway.app",  # Old Render URL
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
    raise ValueError(
        "JWT_SECRET_KEY environment variable is not set. "
        "This is required for authentication. Set it in Railway Variables."
    )

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

# ============================================
# Serve React Frontend
# ============================================
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """
    Serve React frontend files from dist/ folder.
    
    This catch-all route:
    1. Tries to serve the requested file if it exists (CSS, JS, images, etc.)
    2. Falls back to index.html for React Router to handle client-side routing
    
    NOTE: Flask API routes (/api/*) are matched BEFORE this catch-all,
    so API endpoints work correctly.
    """
    static_folder = app.static_folder
    
    # If path is empty (root), serve index.html
    if path == '':
        index_path = os.path.join(static_folder, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder, 'index.html')
    
    # If requested path is a file that exists, serve it
    if os.path.exists(os.path.join(static_folder, path)):
        return send_from_directory(static_folder, path)
    
    # Fallback to index.html for React Router SPA navigation
    index_path = os.path.join(static_folder, 'index.html')
    if os.path.exists(index_path):
        return send_from_directory(static_folder, 'index.html')
    
    # If dist/ folder doesn't exist, return helpful error
    return {
        "error": "React build not found",
        "message": "Run 'npm run build' in project root to create the dist/ folder",
        "static_folder": static_folder,
        "exists": os.path.exists(static_folder)
    }, 404

if __name__ == '__main__':
    # Railway uses PORT 8080 by default
    # Local development uses 3001
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=ENV == "development")