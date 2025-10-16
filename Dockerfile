# Use Node.js 20 Alpine image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# Start Angular development server
CMD ["npm", "start"]
