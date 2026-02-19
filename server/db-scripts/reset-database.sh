#!/bin/bash
# Reset the entire database (delete all data)

echo "⚠️  WARNING: This will delete ALL data from the database!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
    echo "Deleting all users..."
    sqlite3 ../database.sqlite "DELETE FROM users;"
    echo "Deleting all sessions..."
    sqlite3 ../database.sqlite "DELETE FROM sessions;"
    echo "✅ Database reset complete."
else
    echo "❌ Operation cancelled."
fi
