📘 Project Documentation: Secure CI/CD DevOps Pipeline
Project Name: CloudGuard / Automated DevOps Pipeline Developer: Mayur Mahindrakar Domain: DevOps, Cloud Computing, Web Development

1. Executive Summary
This project demonstrates a complete end-to-end DevOps lifecycle. It involves deploying a Node.js application on an AWS EC2 instance, securing it with an SSL certificate (HTTPS), and automating the deployment process using GitHub Actions. The infrastructure ensures high availability, security, and zero-downtime deployment.

2. Technology Stack
Cloud Provider: AWS (EC2 Instance - Ubuntu 24.04/22.04)

Web Server/Reverse Proxy: Nginx

Runtime Environment: Node.js & NPM

Process Manager: PM2

Domain & DNS: DuckDNS

Security (SSL): Let's Encrypt (Certbot)

CI/CD Automation: GitHub Actions

Version Control: Git & GitHub

3. Implementation Guide (Step-by-Step)
Phase 1: Server Setup (AWS EC2)
Launch Instance:

Created an AWS EC2 instance (Ubuntu Image).

Allowed Inbound Traffic: HTTP (80), HTTPS (443), SSH (22), Custom TCP (3000).

Connect to Server:

Bash
ssh -i "your-key.pem" ubuntu@<PUBLIC-IP>
Update System & Install Node.js:

Bash
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
Install Nginx (Web Server):

Bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
Phase 2: Application Deployment
Clone Repository:

Bash
git clone https://github.com/mayurmahi/node-devops-project.git
cd node-devops-project
Install Dependencies:

Bash
npm install
Start Application with PM2:

Bash
sudo npm install -g pm2
pm2 start app.js
pm2 save
pm2 startup
Phase 3: Reverse Proxy & Domain Setup
Configure Nginx: Edited the default configuration file to forward traffic from Port 80 to Port 3000.

Bash
sudo nano /etc/nginx/sites-available/default
Configuration Added:

Nginx
server_name mayur-mahi-project.duckdns.org;

location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
Restart Nginx:

Bash
sudo systemctl restart nginx
Phase 4: Security (SSL/HTTPS)
Install Certbot:

Bash
sudo apt install certbot python3-certbot-nginx -y
Generate SSL Certificate:

Bash
sudo certbot --nginx
Result: Automated redirect from HTTP to HTTPS enabled.

Phase 5: CI/CD Automation
GitHub Secrets Configured:

HOST_IP: AWS Public IP

USERNAME: ubuntu

EC2_SSH_KEY: Private Key (.pem file content)

Workflow File (.github/workflows/deploy.yml): Created a YAML script that automatically triggers on git push, logs into the server via SSH, pulls the latest code, and restarts the application.

⚠️ 4. Operational Manual (The Restart Guide)
Use this guide when you start the server after it has been STOPPED.

When an AWS EC2 instance is stopped and started again, the Public IP Address changes. Follow these steps to bring the project back online.

Step 1: Get New IP Address
Login to AWS Console > EC2 Dashboard.

Select your instance and click Start Instance.

Wait for the state to become "Running".

Copy the new Public IPv4 Address (e.g., 54.12.34.56).

Step 2: Update DNS (DuckDNS)
Why: To ensure mayur-mahi-project.duckdns.org points to the new server IP.

Action:

Go to duckdns.org.

Login and find your domain.

Paste the New AWS IP in the update box.

Click "update ip".

Step 3: Update CI/CD Pipeline (GitHub)
Why: So that GitHub Actions can find the server to deploy new code.

Action:

Go to your GitHub Repository > Settings.

Navigate to Secrets and variables > Actions.

Find HOST_IP.

Click the Edit (Pencil) Icon and paste the New AWS IP.

Click Update Secret.

Step 4: Verify Server Application (SSH)
Why: To ensure the app started automatically.

Action:

Open your terminal and connect using the NEW IP:

Bash
ssh -i "your-key.pem" ubuntu@NEW-IP-ADDRESS
Check if the app is running:

Bash
pm2 list
Scenario A (It shows "online"): You are good to go! ✅

Scenario B (List is empty or "stopped"): Run these commands:

Bash
cd node-devops-project
pm2 start app.js
Step 5: Final Check
Open your browser and visit: https://mayur-mahi-project.duckdns.org If the dashboard loads, the system is fully operational. 🚀
