#!/bin/bash

# AI Foundry Backup Script
# This script creates backups of the application data and configurations

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="ai_foundry_backup_${TIMESTAMP}"

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

# Create backup directory
mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"

echo_info "Starting AI Foundry backup to ${BACKUP_DIR}/${BACKUP_NAME}"

# Backup configuration files
echo_info "Backing up configuration files..."
mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}/config"

# Copy docker-compose files
cp docker-compose*.yml "${BACKUP_DIR}/${BACKUP_NAME}/config/" 2>/dev/null || echo_warn "No docker-compose files found"

# Copy environment examples
cp .env.example "${BACKUP_DIR}/${BACKUP_NAME}/config/" 2>/dev/null || echo_warn "No .env.example found"

# Backup each service configuration
for service in backend-node backend-python frontend-react; do
    if [ -d "$service" ]; then
        echo_info "Backing up $service configuration..."
        mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}/config/$service"
        
        # Copy package.json, requirements.txt, etc.
        cp "$service/package.json" "${BACKUP_DIR}/${BACKUP_NAME}/config/$service/" 2>/dev/null || true
        cp "$service/requirements*.txt" "${BACKUP_DIR}/${BACKUP_NAME}/config/$service/" 2>/dev/null || true
        cp "$service/.env.example" "${BACKUP_DIR}/${BACKUP_NAME}/config/$service/" 2>/dev/null || true
        cp "$service/Dockerfile*" "${BACKUP_DIR}/${BACKUP_NAME}/config/$service/" 2>/dev/null || true
    fi
done

# Backup database (if running with docker-compose)
echo_info "Checking for database backup..."
if docker-compose ps postgres >/dev/null 2>&1; then
    echo_info "Backing up PostgreSQL database..."
    mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}/database"
    
    docker-compose exec -T postgres pg_dump -U ai_foundry ai_foundry > "${BACKUP_DIR}/${BACKUP_NAME}/database/postgres_backup.sql" 2>/dev/null || echo_warn "Failed to backup PostgreSQL database"
else
    echo_warn "PostgreSQL container not running, skipping database backup"
fi

# Backup Redis data (if running with docker-compose)
if docker-compose ps redis >/dev/null 2>&1; then
    echo_info "Backing up Redis data..."
    mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}/redis"
    
    docker-compose exec -T redis redis-cli --rdb /data/dump.rdb >/dev/null 2>&1 || echo_warn "Failed to backup Redis data"
    docker cp $(docker-compose ps -q redis):/data/dump.rdb "${BACKUP_DIR}/${BACKUP_NAME}/redis/" 2>/dev/null || echo_warn "Failed to copy Redis dump"
else
    echo_warn "Redis container not running, skipping Redis backup"
fi

# Create backup metadata
echo_info "Creating backup metadata..."
cat > "${BACKUP_DIR}/${BACKUP_NAME}/backup_info.txt" << EOF
AI Foundry Backup Information
============================
Backup Date: $(date)
Backup Name: ${BACKUP_NAME}
Hostname: $(hostname)
User: $(whoami)
Git Commit: $(git rev-parse HEAD 2>/dev/null || echo "Not a git repository")
Git Branch: $(git branch --show-current 2>/dev/null || echo "Not a git repository")

Services Status:
$(docker-compose ps 2>/dev/null || echo "Docker compose not running")

System Information:
$(uname -a)

Backup Contents:
$(find "${BACKUP_DIR}/${BACKUP_NAME}" -type f | sort)
EOF

# Create compressed backup
echo_info "Creating compressed backup..."
cd "${BACKUP_DIR}"
tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}/"

# Calculate checksum
echo_info "Calculating backup checksum..."
sha256sum "${BACKUP_NAME}.tar.gz" > "${BACKUP_NAME}.tar.gz.sha256"

# Cleanup uncompressed backup
rm -rf "${BACKUP_NAME}/"

echo_info "Backup completed successfully!"
echo_info "Backup file: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
echo_info "Checksum file: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.sha256"

# Optional: Clean up old backups (keep last 5)
echo_info "Cleaning up old backups..."
cd "${BACKUP_DIR}"
ls -t ai_foundry_backup_*.tar.gz | tail -n +6 | xargs rm -f || true
ls -t ai_foundry_backup_*.tar.gz.sha256 | tail -n +6 | xargs rm -f || true

echo_info "Backup process completed!"

# Optional: Upload to cloud storage (uncomment and configure as needed)
# echo_info "Uploading backup to cloud storage..."
# aws s3 cp "${BACKUP_NAME}.tar.gz" s3://your-backup-bucket/ || echo_warn "Failed to upload to S3"
# az storage blob upload --file "${BACKUP_NAME}.tar.gz" --name "${BACKUP_NAME}.tar.gz" --container-name backups || echo_warn "Failed to upload to Azure Storage"