#!/bin/sh

# Wait for MongoDB to be ready
echo "Waiting for MongoDB to be ready..."
until mongo --host mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  sleep 5
done
echo "MongoDB is ready."

# Run the seed script
echo "Running seed script..."

# Seed the database
node src/seeders/product.js
node src/seeders/coupon.js
node src/seeders/administrator.js

# Start the backend server
echo "Starting backend server..."
exec npm start
