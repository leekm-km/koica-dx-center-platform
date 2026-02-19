#!/bin/bash
# Open SQLite interactive shell

echo "Opening SQLite interactive shell..."
echo "Useful commands:"
echo "  .tables          - List all tables"
echo "  .schema users    - Show users table structure"
echo "  SELECT * FROM users;  - View all users"
echo "  .quit            - Exit"
echo ""

sqlite3 ../database.sqlite
