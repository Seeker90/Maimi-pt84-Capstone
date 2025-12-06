# Stage 1: Build React with Node.js
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Accept build args and convert to env vars for Vite
ARG VITE_BACKEND_URL
ARG VITE_MAPBOX_API_KEY
ARG VITE_BASENAME

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_MAPBOX_API_KEY=${VITE_MAPBOX_API_KEY}
ENV VITE_BASENAME=${VITE_BASENAME}

RUN npm run build

# Stage 2: Final image with Python
FROM python:3.11-slim

WORKDIR /app

# Install pip dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy built React from builder stage
COPY --from=builder /app/dist ./dist

# Copy Flask app
COPY src/ src/

# Copy migrations
COPY src/migrations/ src/migrations/

# Expose port
EXPOSE 8000

# Run migrations and start gunicorn
CMD sh -c "cd /app/src && python -m flask db upgrade && gunicorn --bind 0.0.0.0:8000 wsgi:app"
