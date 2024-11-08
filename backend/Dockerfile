# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables to prevent Python from writing pyc files and buffering stdout/stderr
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY ./requirements.txt /app/requirements.txt

# Install any necessary dependencies
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the rest of the application files into the container
COPY . /app/

# Expose the port the app runs on (8000 for Django)
EXPOSE 8000

# Run the Django development server (you can change this to Gunicorn for production)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
