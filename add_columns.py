import os
from sqlalchemy import text
from src.api.models import db
from src.app import create_app

# Get the database URL from environment
DATABASE_URL = os.getenv('DATABASE_URL')

if not DATABASE_URL:
    print("Error: DATABASE_URL not set in environment")
    exit(1)

# Create Flask app context
app = create_app()

with app.app_context():
    try:
        # Add the columns
        db.session.execute(text("""
            ALTER TABLE providers 
            ADD COLUMN latitude DECIMAL(10, 8),
            ADD COLUMN longitude DECIMAL(11, 8)
        """))
        db.session.commit()
        print("✅ Successfully added latitude and longitude columns to providers table")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.session.rollback()