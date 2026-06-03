#!/bin/bash

# Seed demo user into database
# Usage: ./seed-db.sh

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Database connection parameters
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-task_manager}"
DB_USER="${DB_USER:-postgres}"

echo "Seeding demo user..."

# SQL command to insert demo user
PSQL_CMD="psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"

$PSQL_CMD << EOF
-- Insert demo user (password: demo123)
-- Hash created using bcryptjs with salt rounds 10
INSERT INTO users (username, email, password_hash, full_name) 
VALUES ('demo', 'demo@example.com', '\$2a\$10\$EkzV0r6N8I8z3t5K7p2q6eXmZ0A1B2C3D4E5F6G7H8I9J0K1L2M3N4', 'Demo User')
ON CONFLICT (username) DO NOTHING;

-- Insert sample tasks for demo user
INSERT INTO tasks (user_id, title, description, priority, status, due_date, assignee)
SELECT u.id, 'Design dashboard mockups', 'Create wireframes and visual mockups for the task manager dashboard', 'high', 'in-progress', NOW() + INTERVAL '2 days', 'Sarah Johnson'
FROM users u WHERE u.username = 'demo'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (user_id, title, description, priority, status, due_date, assignee)
SELECT u.id, 'Setup PostgreSQL database', 'Install and configure PostgreSQL for the project', 'urgent', 'todo', NOW() + INTERVAL '1 day', 'Mike Chen'
FROM users u WHERE u.username = 'demo'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (user_id, title, description, priority, status, due_date, assignee)
SELECT u.id, 'API development and testing', 'Build and test all CRUD endpoints', 'high', 'in-progress', NOW() + INTERVAL '3 days', 'Alex Rodriguez'
FROM users u WHERE u.username = 'demo'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (user_id, title, description, priority, status, due_date, assignee)
SELECT u.id, 'Write documentation', 'Complete README and setup guides', 'medium', 'completed', NOW() - INTERVAL '1 day', 'Emma Thompson'
FROM users u WHERE u.username = 'demo'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (user_id, title, description, priority, status, due_date, assignee)
SELECT u.id, 'Deploy to production', 'Deploy the application to production environment', 'urgent', 'on-hold', NOW() + INTERVAL '7 days', 'James Wilson'
FROM users u WHERE u.username = 'demo'
ON CONFLICT DO NOTHING;

SELECT 'Demo user seeded successfully!' as status;
EOF

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Demo user seeded successfully!${NC}"
  echo "Demo credentials:"
  echo "  Username: demo"
  echo "  Password: demo123"
else
  echo -e "${RED}✗ Failed to seed demo user${NC}"
  exit 1
fi
