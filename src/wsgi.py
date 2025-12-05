import os
import sys
from flask import send_from_directory

# Add src to path so imports work from root or from src/
sys.path.insert(0, os.path.dirname(__file__))

from app import app

if __name__ == '__main__':
    app.run()