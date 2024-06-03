#!/bin/sh

# Wait for database to be ready
sleep 30

FLAG_FILE=".migrated_and_seeded"

# Check if the flag file exists
if [ ! -f $FLAG_FILE ]; then
  # Run migrations and seeds
  npm run migrate
  npm run seed

  # Create the flag file
  touch $FLAG_FILE
fi

npm run start