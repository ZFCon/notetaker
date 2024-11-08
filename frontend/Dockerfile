# Stage 1: Build the React app
FROM node:18-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) for installing dependencies
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the entire React project to the working directory
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the app without Nginx, using a simple static server
FROM node:18-slim

# Install the `serve` package globally to serve the production build
RUN npm install -g serve

# Set the working directory
WORKDIR /app

# Copy the built React app from the previous stage
COPY --from=build /app/build /app/build

# Expose port 3000 to access the app
EXPOSE 3000

# Serve the React app using `serve`
CMD ["serve", "-s", "build", "-l", "3000"]
