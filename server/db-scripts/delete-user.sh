#!/bin/bash
# Delete a user by email
# Usage: ./delete-user.sh user@example.com

if [ -z "$1" ]; then
    echo "Usage: ./delete-user.sh <email>"
    exit 1
fi

EMAIL=$1
echo "Deleting user: $EMAIL"
sqlite3 ../database.sqlite "DELETE FROM users WHERE email='$EMAIL';"
echo "User deleted."
