from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Float, Text, Date, Time, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from typing import Optional

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True, nullable=False)
    
    # Relationships
    customer_profile: Mapped[Optional["Customer"]] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    provider_profile: Mapped[Optional["Provider"]] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "role": self.role
        }

class Provider(db.Model):
    __tablename__ = 'providers'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    business_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    state: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    zip_code: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)
    profile_image: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    total_reviews: Mapped[int] = mapped_column(Integer, default=0)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship(back_populates="provider_profile")
    services: Mapped[list["Service"]] = relationship(back_populates="provider", cascade="all, delete-orphan")
    bookings: Mapped[list["Booking"]] = relationship(back_populates="provider")
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'businessName': self.business_name,
            'email': self.user.email,
            'phone': self.phone,
            'description': self.description,
            'address': self.address,
            'city': self.city,
            'state': self.state,
            'zipCode': self.zip_code,
            'profileImage': self.profile_image,
            'rating': self.rating,
            'totalReviews': self.total_reviews,
            'isVerified': self.is_verified
        }

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    address: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    # Relationships
    user: Mapped["User"] = relationship(back_populates="customer_profile")
    bookings: Mapped[list["Booking"]] = relationship(back_populates="customer")
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'address': self.address
        }

class Service(db.Model):
    __tablename__ = 'services'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    provider_id: Mapped[int] = mapped_column(ForeignKey('providers.id'), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    duration: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    # Relationships
    provider: Mapped["Provider"] = relationship(back_populates="services")
    bookings: Mapped[list["Booking"]] = relationship(back_populates="service")
    
    def serialize(self):
        return {
            'id': self.id,
            'providerId': self.provider_id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'price': self.price,
            'duration': self.duration,
            'isActive': self.is_active,
            'createdAt': self.created_at.isoformat()
        }

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id: Mapped[int] = mapped_column(primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey('customers.id'), nullable=False)
    provider_id: Mapped[int] = mapped_column(ForeignKey('providers.id'), nullable=False)
    service_id: Mapped[int] = mapped_column(ForeignKey('services.id'), nullable=False)

    booking_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    booking_time: Mapped[datetime.time] = mapped_column(Time, nullable=False)

    status: Mapped[str] = mapped_column(String(20), default='pending')
    total_price: Mapped[float] = mapped_column(Float, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow)
    
    customer: Mapped["Customer"] = relationship(back_populates="bookings")
    provider: Mapped["Provider"] = relationship(back_populates="bookings")
    service: Mapped["Service"] = relationship(back_populates="bookings")
    
    def serialize(self):
        return {
            'id': self.id,
            'customerId': self.customer_id,
            'customerName': self.customer.name,
            'providerId': self.provider_id,
            'serviceId': self.service_id,
            'serviceName': self.service.name,
            'date': self.booking_date.isoformat(),
            'time': self.booking_time.strftime('%H:%M'),
            'status': self.status,
            'totalPrice': self.total_price,
            'notes': self.notes,
            'createdAt': self.created_at.isoformat()
        }