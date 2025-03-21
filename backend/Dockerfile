# FROM docker.io/rust:latest
# WORKDIR /app
# RUN apt-get update


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

# Expose the port your backend is running on (e.g., 5000)
EXPOSE 3001

# Command to run the backend
CMD ["node", "server.js"]
