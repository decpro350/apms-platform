#!/bin/bash

# APMS Deployment Script

echo "🚀 Starting Deployment..."

# 1. Pull latest changes (already done by GH action but safe to repeat)
git pull origin main

# 2. Build and restart containers
echo "📦 Rebuilding containers..."
docker compose up -d --build

# 3. Database Migrations
echo "🗄️ Running database migrations..."
docker compose exec -T server npx prisma migrate deploy

# 4. Cleanup
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment Successful!"
