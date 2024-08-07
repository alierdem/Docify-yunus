# Stage 1: Build React frontend
FROM node:14 as build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY invoice-reader/package.json ./invoice-reader/

# Install dependencies
RUN cd invoice-reader && npm install

# Copy the entire React app to the working directory
COPY invoice-reader/ ./invoice-reader/

# Build the React app
RUN cd invoice-reader && npm run build

# Stage 2: Set up Flask backend
FROM python:3.8

# Set the working directory
WORKDIR /app

# Copy the Flask app to the working directory
COPY flask/ ./flask/

# Copy the built React app from the previous stage
COPY --from=build /app/invoice-reader/build/ ./invoice-reader/build/

# Install Flask dependencies
RUN pip install -r flask/requirements.txt

# Expose the port that Flask will run on
EXPOSE 8080

# Set the environment variable for Flask
ENV FLASK_APP=flask/app.py

# Run the Flask application
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]
