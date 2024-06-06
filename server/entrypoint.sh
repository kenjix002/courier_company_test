#!/bin/sh

# Wait for database to be ready

FLAG_FILE=".migrated_and_seeded"

# Check if the flag file exists
if [ ! -f $FLAG_FILE ]; then
  # Run migrations and seeds
  if npm run migrate; then
    echo "Migrations completed successfully."
  else
    echo "Migration failed."
    exit 1
  fi

  if npm run seed; then
    echo "Seeding completed successfully."
  else
    echo "Seeding failed."
    exit 1
  fi

  # Create the flag file
  touch $FLAG_FILE
fi

npm run start