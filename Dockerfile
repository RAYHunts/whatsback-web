# Use official Node.js Slim image
FROM node:20-slim

# Install dependencies for Chromium and process management
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-freefont-ttf \
    libnss3 \
    libfreetype6 \
    libharfbuzz0b \
    libgbm1 \          
    libxshmfence1 \    
    ca-certificates \
    curl \
    netcat-openbsd \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Configure Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    CHROME_PATH=/usr/bin/chromium \
    DISABLE_SETUID_SANDBOX=1 \
    NODE_ENV=production

# Create non-root user and set permissions
RUN groupadd -r appuser && \
    useradd -r -g appuser -G audio,video appuser && \
    mkdir -p /usr/src/app /data && \
    mkdir -p /home/appuser/.chromium && \
    chown -R appuser:appuser /usr/src/app /home/appuser /data

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY --chown=appuser:appuser package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy application code
COPY --chown=appuser:appuser . .

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 5001

# Default command (can be overridden in docker-compose)
CMD ["dumb-init", "node", "server.js"]