# Deploying SkillPath-AI Backend on Render

This guide outlines how to deploy the Spring Boot backend of **SkillPath-AI** to [Render](https://render.com) using containerized Docker or Render's Blueprint.

---

## Architecture Overview

- **Runtime**: Java 21 (Eclipse Temurin Alpine)
- **Containerization**: Multi-stage lightweight Docker image (~140MB)
- **Default Port**: Render dynamically assigns `$PORT` (configured to bind automatically)
- **Health Check Path**: `/api/health`
- **Default Database**: In-memory H2 (zero setup required to test immediately)
- **Production Database**: Render Managed PostgreSQL (or external MySQL/Postgres)

---

## Method 1: 1-Click Blueprint Deployment (Recommended)

Render can automatically parse the [`render.yaml`](../render.yaml) file included in the repository:

1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository: `https://github.com/Sohail08-coder/skill-path`.
4. Render will detect `render.yaml` and configure:
   - **Service Name**: `skillpath-ai-backend`
   - **Environment**: Docker
   - **Health Check**: `/api/health`
   - **Environment Variables**: `PORT`, `CORS_ALLOWED_ORIGINS`, `JWT_SECRET`
5. Click **Apply**. Render will automatically build the Docker image and deploy your service!

---

## Method 2: Manual Web Service Deployment

If you prefer to configure the Web Service manually via the Render UI:

1. In the Render Dashboard, click **New +** > **Web Service**.
2. Select **Build and deploy from a Git repository** and pick `Sohail08-coder/skill-path`.
3. Configure the following fields:
   - **Name**: `skillpath-ai-backend` (or your choice)
   - **Region**: Choose the region closest to you (e.g., Singapore, Oregon, Frankfurt)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (uses root `Dockerfile`) **OR** set to `backend` (uses `backend/Dockerfile`)
   - **Runtime**: **Docker**
   - **Instance Type**: **Free**
4. Under **Advanced** > **Health Check Path**, enter:
   ```
   /api/health
   ```
5. Under **Environment Variables**, add:
   | Key | Value / Notes |
   |---|---|
   | `PORT` | `8080` (or leave empty, Render injects its own port) |
   | `CORS_ALLOWED_ORIGINS` | `https://*.netlify.app,https://*.onrender.com,http://localhost:5500` |
   | `JWT_SECRET` | *(Click "Generate" or provide a 256-bit secret string)* |
   | `JWT_EXPIRATION_MS` | `86400000` (24 hours) |

6. Click **Create Web Service**.

---

## Optional: Connecting a Persistent PostgreSQL Database on Render

By default, the backend runs on an in-memory H2 database, which is ideal for testing with zero setup. To persist data across server restarts:

1. In Render Dashboard, click **New +** > **PostgreSQL**.
2. Name it `skillpath-db` and select the Free tier.
3. Once created, copy the **Internal Database URL** (for services within Render) or **External Database URL**.
4. In your `skillpath-ai-backend` service settings > **Environment Variables**, add:
   ```env
   SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<database>
   SPRING_DATASOURCE_USERNAME=<user>
   SPRING_DATASOURCE_PASSWORD=<password>
   SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   ```
   *(Note: Ensure the URL prefix is `jdbc:postgresql://`)*

---

## Connecting Your Frontend

Once your backend is live, Render provides a public URL (e.g. `https://skillpath-ai-backend.onrender.com`).

### Option A: Via Environment or Window Object
Set `window.SKILLPATH_API_URL = 'https://skillpath-ai-backend.onrender.com/api'` before loading `api.js`.

### Option B: Via Browser LocalStorage (No Code Changes Needed!)
In your frontend browser console, run:
```javascript
localStorage.setItem('SKILLPATH_API_URL', 'https://skillpath-ai-backend.onrender.com/api');
```
and refresh the page.

---

## Verifying Deployment

Visit:
```
https://<your-render-app>.onrender.com/api/health
```
You should see:
```json
{
  "service": "SkillPath-AI REST API",
  "version": "2.1.0",
  "status": "UP",
  "timestamp": 1728912345678
}
```
