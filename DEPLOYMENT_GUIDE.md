# 🚀 Hướng Dẫn Triển Khai VPS - Simple Blog

**Student ID:** 2212440  
**Date:** May 15, 2026  
**Status:** ✅ Sẵn sàng triển khai

---

## 📋 Yêu Cầu Tiên Quyết

### 1. **VPS Server (Khuyến nghị)**
- **Ubuntu 22.04 LTS** hoặc CentOS 8+
- **2GB RAM** (tối thiểu)
- **20GB Storage** (tối thiểu)
- **Public IP hoặc Domain**
- SSH access

**VPS Options:**
- DigitalOcean ($5/month)
- Linode ($5/month)
- Vultr ($5/month)
- AWS EC2 (free tier)
- Hetzner (€3/month)

### 2. **Domain Name** (Optional nhưng khuyến nghị)
- Mua domain từ: Namecheap, GoDaddy, Cloudflare, hoặc tương đương
- Cấu hình DNS pointing tới VPS IP

### 3. **Công cụ Bắt Buộc**
- Docker & Docker Compose
- Node.js 20+ (nếu không dùng Docker)
- Git

---

## 🐳 **Phần 1: Docker Containerization**

### Step 1.1: Kiểm Tra Docker Environment Cục Bộ

```bash
# Kiểm tra Docker installation
docker --version
docker-compose --version

# Build Docker image
docker-compose build

# Test chạy local
docker-compose up

# Truy cập tại http://localhost:3000
```

### Step 1.2: Chuẩn Bị .env.local

```bash
# Copy .env.local sang một file an toàn
cat .env.local

# Nội dung cần có:
NEXT_PUBLIC_SUPABASE_URL=https://bwsuuckbekvfgahwawvl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_smYrzflTVCK6Ek9jJTl7IQ_PMKs-_2_
```

### Step 1.3: Tạo .env.production

```bash
cat > .env.production << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bwsuuckbekvfgahwawvl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_smYrzflTVCK6Ek9jJTl7IQ_PMKs-_2_
EOF
```

---

## 🖥️ **Phần 2: Cấu Hình VPS Server**

### Step 2.1: Kết Nối SSH

```bash
# SSH vào VPS
ssh root@your_vps_ip
# hoặc
ssh ubuntu@your_vps_ip
```

### Step 2.2: Cập Nhật System

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

### Step 2.3: Cài Đặt Docker

#### Cho Ubuntu/Debian:
```bash
# Cài Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào docker group
sudo usermod -aG docker $USER
newgrp docker

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Kiểm tra
docker --version
docker-compose --version
```

#### Cho CentOS/RHEL:
```bash
# Cài Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Cài Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2.4: Cài Đặt Git

```bash
# Ubuntu/Debian
sudo apt install -y git

# CentOS/RHEL
sudo yum install -y git
```

### Step 2.5: Tạo Application Directory

```bash
# Tạo directory cho application
sudo mkdir -p /var/www/simple-blog
cd /var/www/simple-blog

# Nếu cần, thay đổi permission
sudo chown $USER:$USER /var/www/simple-blog
```

---

## 📦 **Phần 3: Deploy Application**

### Step 3.1: Clone Repository

```bash
cd /var/www/simple-blog
git clone https://github.com/your-username/simple-blog.git .

# Nếu là private repo, setup SSH key hoặc sử dụng Personal Access Token
```

### Step 3.2: Cấu Hình Environment Variables

```bash
# Copy environment file
cp .env.local .env.production
# hoặc tạo mới nếu không có
cat > .env.production << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://bwsuuckbekvfgahwawvl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_smYrzflTVCK6Ek9jJTl7IQ_PMKs-_2_
EOF

# Giữ file an toàn
chmod 600 .env.production
```

### Step 3.3: Build & Run Docker Container

```bash
# Build image
docker-compose build

# Start service
docker-compose up -d

# Kiểm tra logs
docker-compose logs -f

# Verify running
docker ps

# Test application
curl http://localhost:3000
```

### Step 3.4: Verify Application

```bash
# Check health
docker-compose ps

# View logs (last 50 lines)
docker-compose logs --tail 50

# Test endpoint
curl -I http://localhost:3000
```

---

## 🔒 **Phần 4: Cấu Hình Nginx Reverse Proxy**

### Step 4.1: Cài Đặt Nginx

```bash
# Ubuntu/Debian
sudo apt install -y nginx

# CentOS/RHEL
sudo yum install -y nginx

# Khởi động Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 4.2: Tạo Nginx Config

```bash
# Tạo configuration
sudo tee /etc/nginx/sites-available/simple-blog > /dev/null << 'EOF'
upstream nextjs_backend {
    server localhost:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name your_domain.com www.your_domain.com;
    
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_min_length 1000;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/simple-blog /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 4.3: Cấu Hình DNS

Cập nhật DNS records của domain:

```
Type:  A Record
Name:  @ (hoặc your_domain)
Value: your_vps_ip
TTL:   3600

Type:  A Record
Name:  www
Value: your_vps_ip
TTL:   3600
```

**DNS Propagation:** Có thể mất 5 phút đến 48 giờ.

---

## 🔐 **Phần 5: SSL/HTTPS Configuration**

### Step 5.1: Cài Đặt Certbot (Let's Encrypt)

```bash
# Ubuntu/Debian
sudo apt install -y certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y certbot python3-certbot-nginx
```

### Step 5.2: Tạo SSL Certificate

```bash
# Tạo certificate cho domain
sudo certbot certonly --nginx -d your_domain.com -d www.your_domain.com --non-interactive --agree-tos --email your_email@example.com

# Hoặc sử dụng standalone (nếu chưa có Nginx)
sudo certbot certonly --standalone -d your_domain.com -d www.your_domain.com --non-interactive --agree-tos --email your_email@example.com
```

### Step 5.3: Update Nginx Config với SSL

```bash
# Update Nginx config
sudo tee /etc/nginx/sites-available/simple-blog > /dev/null << 'EOF'
upstream nextjs_backend {
    server localhost:3000;
    keepalive 64;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your_domain.com www.your_domain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your_domain.com www.your_domain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your_domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your_domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    client_max_body_size 100M;
    
    location / {
        proxy_pass http://nextjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_min_length 1000;
}
EOF

# Test & Reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5.4: Auto-Renew SSL Certificate

```bash
# Kiểm tra auto-renewal
sudo systemctl status certbot.timer

# Hoặc setup cron job
sudo certbot renew --dry-run

# Cron sẽ tự động chạy hàng ngày
```

---

## 📊 **Phần 6: Monitoring & Maintenance**

### Step 6.1: View Logs

```bash
# Application logs
docker-compose logs -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System logs
sudo journalctl -u docker.service -f
```

### Step 6.2: Updates & Restarts

```bash
# Pull latest code
cd /var/www/simple-blog
git pull origin main

# Rebuild & restart
docker-compose down
docker-compose build
docker-compose up -d

# Check status
docker-compose ps
```

### Step 6.3: Backup Configuration

```bash
# Backup Nginx config
sudo tar -czf /home/backup-nginx-$(date +%Y%m%d).tar.gz /etc/nginx/

# Backup SSL certificates
sudo tar -czf /home/backup-ssl-$(date +%Y%m%d).tar.gz /etc/letsencrypt/

# Backup .env files
tar -czf /var/www/simple-blog/backup-env-$(date +%Y%m%d).tar.gz .env.production
```

---

## 🧪 **Phần 7: Testing Deployment**

### Test URL
```
http://your_domain.com      (Redirect to HTTPS)
https://your_domain.com     (Secure)
www.your_domain.com         (Works)
```

### Health Check
```bash
# Check SSL certificate
curl -I https://your_domain.com

# Check response time
curl -w "@curl-format.txt" -o /dev/null -s https://your_domain.com

# Check headers
curl -I https://your_domain.com | grep -E "Server|X-|Strict"
```

### Performance Test
```bash
# Lighthouse
# Visit: https://lighthouse.web.dev
# Input: https://your_domain.com

# GTmetrix
# Visit: https://gtmetrix.com
# Input: https://your_domain.com
```

---

## ⚠️ **Troubleshooting**

### Issue 1: Connection Refused

```bash
# Check if container is running
docker-compose ps

# View logs
docker-compose logs app

# Restart container
docker-compose restart app
```

### Issue 2: DNS Not Resolving

```bash
# Check DNS records
nslookup your_domain.com
dig your_domain.com

# Wait for propagation (up to 48 hours)
```

### Issue 3: SSL Certificate Error

```bash
# Renew certificate
sudo certbot renew --force-renewal

# Check certificate validity
sudo certbot certificates

# Reload Nginx
sudo systemctl reload nginx
```

### Issue 4: 502 Bad Gateway

```bash
# Check Nginx config
sudo nginx -t

# Check if Next.js is running
curl http://localhost:3000

# View Docker logs
docker-compose logs -f
```

### Issue 5: Out of Memory

```bash
# Check resource usage
docker stats

# Increase memory limits in docker-compose.yml
# Restart service
docker-compose down
docker-compose up -d
```

---

## 📋 **Deployment Checklist**

- [ ] VPS server created with Ubuntu 22.04
- [ ] Docker & Docker Compose installed
- [ ] Application code cloned
- [ ] .env.production configured with Supabase credentials
- [ ] Docker image built successfully
- [ ] Application running on http://localhost:3000
- [ ] Nginx reverse proxy configured
- [ ] Domain DNS pointing to VPS IP
- [ ] SSL certificate installed via Let's Encrypt
- [ ] HTTPS working (https://your_domain.com)
- [ ] Security headers configured
- [ ] Static files caching working
- [ ] Gzip compression enabled
- [ ] Auto-renewal cron set up
- [ ] Backup strategy implemented
- [ ] Monitoring logs configured

---

## 🎯 **Quick Deployment Summary**

```bash
# 1. On VPS
ssh root@your_vps_ip
curl -fsSL https://get.docker.com | sh
sudo apt install -y git nginx certbot python3-certbot-nginx

# 2. Clone & Configure
cd /var/www/simple-blog
git clone https://github.com/your-username/simple-blog.git .
echo "NEXT_PUBLIC_SUPABASE_URL=..." > .env.production
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=..." >> .env.production

# 3. Deploy
docker-compose build && docker-compose up -d

# 4. Setup SSL & Nginx
sudo certbot certonly --nginx -d your_domain.com
# Update Nginx config (see Step 5.3)
sudo systemctl reload nginx

# 5. Done!
curl https://your_domain.com
```

---

## 📞 **Support & Resources**

- **Docker Documentation:** https://docs.docker.com
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Nginx Documentation:** https://nginx.org/en/docs/
- **Let's Encrypt:** https://letsencrypt.org
- **Supabase Docs:** https://supabase.com/docs

---

## ✅ **Deployment Complete!**

Application is now deployed, secured with SSL, and accessible via your domain with HTTPS! 🎉
