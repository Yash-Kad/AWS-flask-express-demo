# Express–Flask Microservice Application

This project is a simple microservice-based web application where an HTML frontend displays data fetched from a Python Flask backend through an Express (Node.js) middleware. The backend reads data from a JSON file and serves it via a REST API. Docker and Docker Compose are used for containerization and service orchestration.

## Architecture
Browser (HTML + JavaScript) → Express (Node.js) → Flask (Python) → JSON File

## Technologies Used
- HTML5, JavaScript (Fetch API)
- Node.js, Express.js
- Python, Flask
- Docker, Docker Compose
- Git & GitHub

## Project Overview
- Flask backend reads `details.json` containing name and age information of multiple people.
- Flask exposes a REST endpoint `/people`.
- Express fetches data from the Flask service and exposes it to the frontend.
- The frontend dynamically displays the data in the browser.

## Running the Application (Docker)

### docker compose up --build

Open the browser at:
http://localhost:3000

To stop the application:
docker compose down


## Running Without Docker (Optional)

### Flask backend:

cd backend-flask
pip install -r requirements.txt
python app.py

### Express frontend:

cd frontend-express
npm install
node app.js

## Key Notes
Services communicate using Docker Compose service names (not localhost).

Both Flask and Express are bound to 0.0.0.0 for container access.

HTTP is used for inter-service communication (no HTTPS).

Learning Outcomes
Microservice architecture

Backend-for-Frontend (BFF) pattern

Inter-service communication between Node.js and Python

Docker container networking and orchestration

License
This project is intended for educational and learning purposes only.
