#!/bin/bash

# Task Manager Database Initialization Script
# This script creates the necessary tables in your local PostgreSQL database

echo "🗄️ Task Manager - Database Setup"
echo "=================================="
echo ""

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed or psql is not in PATH"
    echo "Please install PostgreSQL first"
    exit 1
fi

echo "📝 Enter your PostgreSQL credentials:"
read -p "Username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Password: " DB_PASSWORD
echo ""

read -p "Host (default: localhost): " DB_HOST
DB_HOST=${DB_HOST:-localhost}

read -p "Port (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

read -p "Database name (default: task_manager): " DB_NAME
DB_NAME=${DB_NAME:-task_manager}

echo ""
echo "Attempting to connect to PostgreSQL..."

# Try to connect and create database
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -p "$DB_PORT" -v ON_ERROR_STOP=1 << EOF
-- Create database if it doesn't exist
CREATE DATABASE $DB_NAME;

\connect $DB_NAME

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'todo',
    due_date TIMESTAMP,
    assignee VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "📋 Configuration:"
    echo "  Database: $DB_NAME"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  User: $DB_USER"
    echo ""
    echo "🔧 Add this to your .env.local file:"
    echo "DATABASE_URL=postgresql://$DB_USER:***@$DB_HOST:$DB_PORT/$DB_NAME"
    echo ""
    echo "🚀 Now run: npm run dev"
else
    echo ""
    echo "❌ Database setup failed. Please check your credentials and PostgreSQL installation."
    exit 1
fi
