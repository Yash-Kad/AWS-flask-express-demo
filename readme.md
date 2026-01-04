# Express–Flask Microservice Application  
## AWS Deployment Guide

This project demonstrates how a simple **microservice-based web application** can be deployed on **Amazon Web Services (AWS)** using multiple infrastructure approaches.

The application consists of an **Express (Node.js) frontend** acting as a Backend-for-Frontend (BFF) and a **Flask (Python) backend** serving data from a JSON file.

Three AWS deployment strategies are implemented:

1. Deployment on a **single EC2 instance**
2. Deployment on **separate EC2 instances**
3. **Containerized deployment using Docker, AWS ECR, ECS (Fargate), and VPC**

---

## Application Architecture

Browser (HTML + JavaScript)
↓
Express (Node.js – BFF Layer)
↓
Flask (Python REST API)
↓
JSON File (details.json)



---

## Application Overview

- Flask reads `details.json` containing multiple people records (name, age).
- Flask exposes a REST API endpoint: `/people`.
- Express fetches data from Flask and exposes it to the frontend.
- The frontend dynamically renders the data in the browser using JavaScript.

---

## AWS Deployment 1: Single EC2 Instance

### Architecture

Browser → EC2 Instance → Express → Flask → JSON File



Both Express and Flask run on the **same EC2 instance**.

### Steps Performed

1. **EC2 Setup**
   - Launched an EC2 instance (Amazon Linux 2 / Ubuntu).
   - Configured Security Group rules:
     - Port 22 – SSH
     - Port 3000 – Express frontend
     - Port 8000 – Flask backend (optional public access)

2. **Environment Setup**
   - Installed:
     - Node.js and npm
     - Python 3 and pip
     - Git

3. **Application Setup**
   - Cloned the project repository from GitHub.
   - Installed dependencies:
     - `npm install` for Express
     - `pip install -r requirements.txt` for Flask

4. **Service Execution**
   - Flask started on `0.0.0.0:8000`
   - Express started on `0.0.0.0:3000`
   - Express communicates with Flask using:
     ```
     http://localhost:8000
     ```

5. **Access**
http://<EC2-PUBLIC-IP>:3000

### Notes

- Simple and fast to deploy.
- Suitable for learning and development.
- Not recommended for production due to a single point of failure.

---

## AWS Deployment 2: Separate EC2 Instances

### Architecture

Browser → Express EC2 → Flask EC2 → JSON File



Express and Flask run on **separate EC2 instances**.

### Steps Performed

1. **EC2 Instances**
   - EC2 #1: Express (Node.js)
   - EC2 #2: Flask (Python)

2. **Security Group Configuration**
   - Express EC2:
     - Port 3000 (public)
   - Flask EC2:
     - Port 8000 (allowed only from Express EC2 security group)

3. **Flask Backend (EC2)**
   - Installed Python and dependencies.
   - Flask bound to `0.0.0.0:8000`
   - Exposed `/people` endpoint.

4. **Express Frontend (EC2)**
   - Installed Node.js and dependencies.
   - Updated Express configuration to call Flask using the **private IP**:
     ```
     http://<FLASK-PRIVATE-IP>:8000
     ```

5. **Access**
http://<EXPRESS-PUBLIC-IP>:3000



### Notes

- Better isolation between services.
- More realistic microservice architecture.
- Enables independent scaling and maintenance.

---

## AWS Deployment 3: Docker + ECR + ECS + VPC

### Architecture

Browser
↓
Application Load Balancer (ALB)
↓
ECS Service (Express Container)
↓
ECS Service (Flask Container)


All services run as **Docker containers** managed by **Amazon ECS (Fargate)**.

---

### Step 1: Dockerization

- Created separate Dockerfiles for:
  - Flask backend
  - Express frontend
- Tested containers locally using Docker Compose.

---

### Step 2: Amazon ECR (Elastic Container Registry)

- Created two ECR repositories:
  - `flask-backend`
  - `express-frontend`

- Built Docker images locally.
- Tagged and pushed images to ECR:

`
docker tag <image> <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repo>:latest
docker push <repo-url>`

Step 3: VPC Configuration
Custom VPC with:

Public subnets (Application Load Balancer)

Private subnets (ECS tasks)

Configured:

Internet Gateway

Route Tables

Security Groups

Step 4: ECS Cluster & Task Definitions
Created ECS Cluster using Fargate.

Defined task definitions:

Flask container → Port 8000

Express container → Port 3000

Configured environment variables so Express can reach Flask using:

ECS service discovery or internal DNS.

Step 5: ECS Services & Load Balancer
Created ECS services for Express and Flask.

Attached Application Load Balancer (ALB) to the Express service.

ALB routes incoming HTTP traffic to Express containers.

Flask service is not publicly exposed.

Access
http://<ALB-DNS-NAME>

Deployment Comparison

Feature	Single EC2	Separate EC2s	ECS + ECR
Scalability	Low	Medium	High
Fault Isolation	Low	Medium	High
Operational Complexity	Low	Medium	High
Production Ready	❌	⚠️	✅

AWS Services Used
Amazon EC2

Amazon VPC

Amazon ECS (Fargate)

Amazon ECR

Application Load Balancer (ALB)

IAM (Roles and Policies)

Key Learning Outcomes
Microservice architecture on AWS

Backend-for-Frontend (BFF) pattern

EC2-based vs container-based deployments

Docker image lifecycle with ECR

ECS task and service orchestration

Secure service-to-service communication inside a VPC

License
This project is intended strictly for educational and learning purposes.
