#!/bin/bash
# View all users in the database

echo "=== All Users ==="
sqlite3 ../database.sqlite "SELECT id, email, full_name, role, track, batch, status, created_at FROM users;"

echo ""
echo "=== User Count ==="
sqlite3 ../database.sqlite "SELECT COUNT(*) as total_users FROM users;"
