# Stage 1: Build React with Node.js
FROM node:22-alpine AS builder

# Declare build args
ARG VITE_BACKEND_URL
ARG VITE_MAPBOX_API_KEY
ARG VITE_BASENAME

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Pass build args as environment variables for Vite
RUN VITE_BACKEND_URL=${VITE_BACKEND_URL} VITE_MAPBOX_API_KEY=${VITE_MAPBOX_API_KEY} VITE_BASENAME=${VITE_BASENAME} npm run build

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

# Expose port
EXPOSE 8000

# Copy migrations folder from root
COPY migrations/ migrations/

# Run Flask migrations, then start gunicorn
CMD sh -c "cd /app && python -m flask db upgrade && cd /app/src && gunicorn --bind 0.0.0.0:8000 wsgi:app"