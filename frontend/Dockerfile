# Use the official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app for production
RUN npm run build

# Install a lightweight HTTP server to serve the static files
RUN npm install -g serve

# Expose port 3000 for the React app
EXPOSE 3000

# Command to serve the built React app
CMD ["serve", "-s", "build"]
