#!/bin/bash

# AI Foundry Restore Script
# This script restores application data and configurations from a backup

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
RESTORE_CONFIRM="${RESTORE_CONFIRM:-false}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 <backup_file>"
    echo ""
    echo "Options:"
    echo "  backup_file    Path to the backup tar.gz file"
    echo ""
    echo "Environment variables:"
    echo "  BACKUP_DIR     Directory containing backups (default: ./backups)"
    echo "  RESTORE_CONFIRM Set to 'true' to skip confirmation prompts"
    echo ""
    echo "Example:"
    echo "  $0 ./backups/ai_foundry_backup_20231201_143000.tar.gz"
}

# Check if backup file is provided
if [ $# -eq 0 ]; then
    echo_error "No backup file specified"
    show_usage
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo_error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Extract backup name from file
BACKUP_NAME=$(basename "$BACKUP_FILE" .tar.gz)

echo_info "Starting restore from: $BACKUP_FILE"

# Verify checksum if available
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
if [ -f "$CHECKSUM_FILE" ]; then
    echo_info "Verifying backup checksum..."
    if sha256sum -c "$CHECKSUM_FILE"; then
        echo_info "Checksum verification passed"
    else
        echo_error "Checksum verification failed!"
        exit 1
    fi
else
    echo_warn "No checksum file found, skipping verification"
fi

# Confirmation prompt
if [ "$RESTORE_CONFIRM" != "true" ]; then
    echo_warn "This will restore data from backup and may overwrite existing configurations."
    echo_warn "Make sure to stop running services before proceeding."
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo_info "Restore cancelled by user"
        exit 0
    fi
fi

# Create temporary restore directory
TEMP_DIR=$(mktemp -d)
echo_info "Extracting backup to temporary directory: $TEMP_DIR"

# Extract backup
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

# Find the extracted backup directory
EXTRACTED_DIR=$(find "$TEMP_DIR" -name "ai_foundry_backup_*" -type d | head -1)

if [ -z "$EXTRACTED_DIR" ]; then
    echo_error "Could not find extracted backup directory"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo_info "Backup extracted to: $EXTRACTED_DIR"

# Show backup information
if [ -f "$EXTRACTED_DIR/backup_info.txt" ]; then
    echo_info "Backup information:"
    cat "$EXTRACTED_DIR/backup_info.txt"
    echo ""
fi

# Restore configuration files
echo_info "Restoring configuration files..."

if [ -d "$EXTRACTED_DIR/config" ]; then
    # Restore docker-compose files
    cp "$EXTRACTED_DIR/config"/docker-compose*.yml . 2>/dev/null || echo_warn "No docker-compose files in backup"
    
    # Restore .env.example
    cp "$EXTRACTED_DIR/config/.env.example" . 2>/dev/null || echo_warn "No .env.example in backup"
    
    # Restore service configurations
    for service_config in "$EXTRACTED_DIR/config"/*; do
        if [ -d "$service_config" ]; then
            service_name=$(basename "$service_config")
            if [ -d "$service_name" ]; then
                echo_info "Restoring $service_name configuration..."
                
                # Backup existing config files
                mkdir -p "./restore_backup_$(date +%s)"
                cp "$service_name/package.json" "./restore_backup_$(date +%s)/" 2>/dev/null || true
                cp "$service_name/requirements*.txt" "./restore_backup_$(date +%s)/" 2>/dev/null || true
                
                # Restore config files
                cp "$service_config"/* "$service_name/" 2>/dev/null || true
            fi
        fi
    done
else
    echo_warn "No configuration files found in backup"
fi

# Restore database
echo_info "Checking for database restore..."
if [ -f "$EXTRACTED_DIR/database/postgres_backup.sql" ]; then
    echo_warn "Database backup found. To restore database:"
    echo "  1. Start PostgreSQL container: docker-compose up -d postgres"
    echo "  2. Wait for database to be ready"
    echo "  3. Restore database: docker-compose exec -T postgres psql -U ai_foundry -d ai_foundry < \"$EXTRACTED_DIR/database/postgres_backup.sql\""
    echo ""
    echo "Or run the following command after starting services:"
    echo "  cat \"$EXTRACTED_DIR/database/postgres_backup.sql\" | docker-compose exec -T postgres psql -U ai_foundry -d ai_foundry"
else
    echo_info "No database backup found"
fi

# Restore Redis data
if [ -f "$EXTRACTED_DIR/redis/dump.rdb" ]; then
    echo_warn "Redis backup found. To restore Redis data:"
    echo "  1. Stop Redis container: docker-compose stop redis"
    echo "  2. Copy dump file: docker cp \"$EXTRACTED_DIR/redis/dump.rdb\" \$(docker-compose ps -q redis):/data/"
    echo "  3. Start Redis container: docker-compose start redis"
else
    echo_info "No Redis backup found"
fi

# Create restore summary
cat > "restore_summary_$(date +%s).txt" << EOF
AI Foundry Restore Summary
=========================
Restore Date: $(date)
Backup File: $BACKUP_FILE
Backup Name: $BACKUP_NAME
Restored To: $(pwd)

Files Restored:
$(find "$EXTRACTED_DIR" -type f | sort)

Next Steps:
1. Review restored configuration files
2. Update environment variables as needed
3. Start services: docker-compose up -d
4. Restore database if needed (see instructions above)
5. Restore Redis data if needed (see instructions above)
6. Verify all services are working correctly

Temporary backup files are in: $TEMP_DIR
These will be automatically cleaned up on next system reboot or you can remove them manually.
EOF

echo_info "Restore completed successfully!"
echo_info "Please review the restore summary: restore_summary_$(date +%s).txt"
echo_info "Temporary files are in: $TEMP_DIR"

echo_warn "Don't forget to:"
echo "  1. Update environment variables in .env file"
echo "  2. Start services: docker-compose up -d"
echo "  3. Restore database and Redis data if needed"
echo "  4. Test all functionality"