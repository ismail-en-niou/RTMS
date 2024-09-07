
# React Application Deployment on NGINX

## Overview

This guide outlines the steps for deploying and updating a React application on an NGINX server. It includes setting up NGINX, deploying your React app, and managing updates.

## Prerequisites

- VPS or server with NGINX installed
- Access to the server with `sudo` privileges
- React application code
- SSL certificate and key files (for HTTPS)

## Setting Up NGINX

### 1. Create NGINX Configuration

Create and edit a new NGINX configuration file:

```bash
sudo nano /etc/nginx/sites-available/team.robixe.online.conf
```

Add the following configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    ssl_certificate /etc/nginx/ssl-certificates/team.robixe.online.crt;
    ssl_certificate_key /etc/nginx/ssl-certificates/team.robixe.online.key;

    server_name team.robixe.online;
    root /home/robixe-team/htdocs/team.robixe.online;

    access_log /home/robixe-team/logs/nginx/access.log main;
    error_log /home/robixe-team/logs/nginx/error.log;

    if ($scheme != "https") {
        return 301 https://$host$request_uri;
    }

    location / {
        try_files $uri /index.html;
    }

    location ~ /.well-known {
        auth_basic off;
        allow all;
    }

    location ~* \.(css|js|jpg|jpeg|gif|png|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
    }

    location ~* \.(gz|svgz|ttf|otf|woff|woff2|eot|mp4|ogg|ogv|webm|webp|zip|swf)$ {
        expires 1y;
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
    }
}
```

### 2. Enable the Configuration

Create a symbolic link to enable the configuration:

```bash
sudo ln -s /etc/nginx/sites-available/team.robixe.online.conf /etc/nginx/sites-enabled/
```

### 3. Test and Restart NGINX

Test the configuration:

```bash
sudo nginx -t
```

Restart NGINX to apply changes:

```bash
sudo systemctl restart nginx
```

## Deploying Your React Application

### 1. Build Your React App

Navigate to your React app directory and build it:

```bash
cd /path/to/your/react-app
npm run build
```

### 2. Upload the Build Files

Copy the build files to the server:

```bash
scp -r build/* user@your-server-ip:/home/robixe-team/htdocs/team.robixe.online/
```

### 3. Set Permissions

Ensure proper permissions for the NGINX user:

```bash
sudo chown -R www-data:www-data /home/robixe-team/htdocs/team.robixe.online/
```

### 4. Verify Deployment

Check your React app at `https://team.robixe.online`.

## Updating Your React Application

### 1. Build and Upload Updates

Make changes, rebuild, and upload:

```bash
cd /path/to/your/react-app
npm run build
scp -r build/* user@your-server-ip:/home/robixe-team/htdocs/team.robixe.online/
```

### 2. Set Permissions

Ensure permissions are correct:

```bash
sudo chown -R www-data:www-data /home/robixe-team/htdocs/team.robixe.online/
```

### 3. Clear Browser Cache

Force refresh or clear your browser cache to view updates.

## Troubleshooting

- **Check NGINX Logs:**

    ```bash
    sudo tail -f /home/robixe-team/logs/nginx/error.log
    ```

- **Verify File Paths:** Ensure correct files are in the root directory.

- **Check NGINX Configuration:** Confirm the configuration is correct.

- **SSL Certificates:** Verify that SSL certificates are correctly placed and paths in the NGINX configuration are accurate.

## Additional Information

- **Origin Web Server:**
  - Review logs for crashes or outages.
  - Ensure Cloudflare IPs are not blocked.
  - Allow Cloudflare IP ranges in your firewall.
  - For SSL/TLS modes Full or Full (Strict), install a Cloudflare Origin Certificate.
  - Visit the [Cloudflare Community](https://community.cloudflare.com) for further assistance.

```

This README should provide clear instructions for setting up, deploying, updating, and troubleshooting your React application on NGINX. If you need any further modifications, just let me know!
