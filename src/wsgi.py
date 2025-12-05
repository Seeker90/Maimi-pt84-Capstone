import os
from flask import Flask, send_from_directory
from app import create_app

# Create Flask app
app = create_app()

# Configure to serve React build folder as static files
app.config['STATIC_FOLDER'] = os.path.join(os.path.dirname(__file__), '../dist')
app.static_folder = os.path.join(os.path.dirname(__file__), '../dist')
app.static_url_path = ''

# Serve React build files
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Serve React frontend, fallback to index.html for SPA routing"""
    static_folder = app.config['STATIC_FOLDER']
    
    # Try to serve the requested file
    if path and os.path.exists(os.path.join(static_folder, path)):
        return send_from_directory(static_folder, path)
    
    # Fallback to index.html for client-side routing
    if os.path.exists(os.path.join(static_folder, 'index.html')):
        return send_from_directory(static_folder, 'index.html')
    
    return "React build not found. Run: npm run build", 404

if __name__ == '__main__':
    app.run()