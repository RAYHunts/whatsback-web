FROM node:20

# Create app directory and set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json separately for better caching
COPY package.json package-lock.json ./

# Install system dependencies and clean up
RUN apt-get update -y && \
    apt-get install -y gnupg nano wget curl openssh-server git -y && \
    apt-get install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget --no-install-recommends -y && \
    npm install

# Bundle app source
COPY . .

EXPOSE 5001

CMD ["node", "server.js"]
