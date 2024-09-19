# Python runtime as base image
FROM python:3.9-slim

# set working directory in container
WORKDIR /app

# copy all in workdir
COPY . /app

# Install Package
RUN pip install --no-cache-dir flask pymongo

# Expose port for APP 
EXPOSE 6000

# Setup Environment Var
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Command to run the app
CMD ["python" , "app.py"]