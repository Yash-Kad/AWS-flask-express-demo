Express–Flask Microservice Application (AWS Deployment Guide)

This README documents how the Express–Flask Microservice Application was deployed on Amazon Web Services (AWS) using three different approaches:

Single EC2 instance deployment

Separate EC2 instances deployment

Dockerized deployment using AWS ECR, ECS, and VPC

This document focuses entirely on AWS-based deployment, architecture, and learning outcomes.

Application Overview

The application follows a simple microservice architecture:

Browser (HTML + JavaScript) → Express (Node.js – BFF layer) → Flask (Python API) → JSON File

Functional Flow

Flask reads details.json containing multiple people records (name, age).

Flask exposes a REST API endpoint: /people.

Express acts as a Backend-for-Frontend (BFF) and fetches data from Flask.

The frontend displays the data dynamically in the browser.

AWS Deployment 1: Single EC2 Instance

Architecture

Browser → EC2 Instance → Express → Flask → JSON File

Both Express and Flask run on the same EC2 instance.

Steps Performed

EC2 Setup

Launched an EC2 instance (Amazon Linux 2 / Ubuntu).

Configured Security Group:

Port 22 (SSH)

Port 3000 (Express frontend)

Port 8000 (Flask backend – optional internal access)

Environment Setup

Installed required packages:

Node.js & npm

Python 3 & pip

Git

Application Setup

Cloned the project repository from GitHub.

Installed dependencies:

npm install for Express

pip install -r requirements.txt for Flask

Service Execution

Flask started on 0.0.0.0:5000.

Express started on 0.0.0.0:3000.

Express communicated with Flask using http://localhost:8000.

Access

Application accessed via:

http://<EC2-PUBLIC-IP>:3000

Key Notes

Suitable for development and testing.

Not ideal for production due to single point of failure.

AWS Deployment 2: Separate EC2 Instances

Architecture

Browser → Express EC2 → Flask EC2 → JSON File

Express and Flask run on different EC2 instances.

Steps Performed

EC2 Instances

Launched two EC2 instances:

EC2 #1: Express (Node.js)

EC2 #2: Flask (Python)

Security Group Configuration

Express EC2:

Port 3000 (Public)

Flask EC2:

Port 8000 (Allowed only from Express EC2 security group)

Backend (Flask EC2)

Installed Python and dependencies.

Flask bound to 0.0.0.0:8000.

Served /people API endpoint.

Frontend (Express EC2)

Installed Node.js and dependencies.

Updated Express configuration to call Flask using private EC2 IP:

http://<FLASK-PRIVATE-IP>:8000

Access

Application accessed via Express EC2 public IP:

http://<EXPRESS-PUBLIC-IP>:3000

Key Notes

Improved service isolation.

Easier to scale services independently.

Better reflects real-world microservice architecture.

AWS Deployment 3: Docker + ECR + ECS + VPC

Architecture

Browser → Application Load Balancer → ECS (Express Container) → ECS (Flask Container)

Services run as Docker containers managed by Amazon ECS.

Step 1: Dockerization

Created separate Dockerfiles for:

Flask backend

Express frontend

Verified containers locally using Docker Compose.

Step 2: Amazon ECR (Elastic Container Registry)

Created two ECR repositories:

flask-backend

express-frontend

Built Docker images locally.

Tagged and pushed images to ECR:

docker tag <image> <aws_account_id>.dkr.ecr.<region>.amazonaws.com/<repo>:latest
docker push <repo-url>

Step 3: VPC Setup

Used a custom VPC with:

Public subnets (ALB)

Private subnets (ECS tasks)

Configured:

Internet Gateway

Route Tables

Step 4: ECS Cluster & Task Definitions

Created ECS Cluster (Fargate).

Defined Task Definitions:

Flask Task:

Port 8000

Express Task:

Port 3000

Environment Variables:

Express service configured with Flask service URL using ECS service discovery or internal load balancer.

Step 5: ECS Services & Load Balancer

Created ECS Services for both containers.

Attached Application Load Balancer (ALB) to Express service.

ALB routes traffic to Express container.

Step 6: Service Communication

Express communicates with Flask using:

Internal DNS name

Service discovery

No public exposure of Flask service.

Access

Application accessed via ALB DNS name:

http://<ALB-DNS-NAME>

Comparison of Deployment Approaches

Feature

Single EC2

Separate EC2s

ECS + ECR

Scalability

Low

Medium

High

Fault Isolation

Low

Medium

High

DevOps Complexity

Low

Medium

High

Production Ready

❌

⚠️

✅

AWS Services Used

Amazon EC2

Amazon VPC

Amazon ECS (Fargate)

Amazon ECR

Application Load Balancer (ALB)

IAM (Roles & Policies)

Key Learning Outcomes

AWS EC2 based deployments

Microservice separation strategies

Backend-for-Frontend (BFF) pattern

Docker image lifecycle in AWS

ECS task and service orchestration

Secure service-to-service communication in VPC

License

This project is intended strictly for educational and learning purposes.
