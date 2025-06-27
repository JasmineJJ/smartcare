# SmartCare 2.0 – Monorepo

This project is split into two folders:

* **backend/** – Django + Django REST Framework (API)
* **frontend/** – Next.js (React) user portal

The stack runs locally via **Docker Compose**, so you don't have to install Python, Node, or PostgreSQL on your machine.

## Prerequisites

* Docker ≥ 20.10
* Docker Compose v2

## Quick Start

```bash
# 1. Copy environment variables template
cp env.example .env

# 2. Build & start the stack (detached)
docker compose up --build -dls

# 3. Visit the apps
# Backend API   → http://localhost:8000/api/
# Frontend      → http://localhost:3000
```

## Useful Commands

```bash
# Stop containers
docker compose down

# Run Django management command
docker compose exec backend python manage.py createsuperuser
```

---

Next steps: implement the Django project skeleton and JWT auth 🔐 

# stop & rebuild only the frontend service
docker compose up --build 