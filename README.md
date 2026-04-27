# APMS - Advance Property Maintenance System

A high-performance, full-stack SaaS platform for multifamily property maintenance providers.

## Tech Stack
- **Frontend**: Next.js 14, Vanilla CSS
- **Backend**: Express.js, Prisma ORM
- **Database**: PostgreSQL
- **DevOps**: Docker, GitHub Actions, Traefik

## Getting Started Locally

1.  **Environment Setup**:
    - Copy `server/.env.example` to `server/.env` and update credentials.
    - Client uses `.env.local` for local development.

2.  **Launch with Docker**:
    ```bash
    docker compose up -d
    ```

3.  **Seed Database**:
    ```bash
    cd server
    npm run prisma:seed
    ```

## Automated Deployment (CI/CD)

The project is configured with GitHub Actions for automatic deployment to your VPS.

### Setup Instructions:

1.  **Add GitHub Secrets**:
    Go to your repository on GitHub -> Settings -> Secrets and variables -> Actions. Add the following secrets:
    - `VPS_HOST`: Your server's IP address (177.7.36.131).
    - `VPS_USER`: Your SSH username (root).
    - `VPS_SSH_KEY`: Your private SSH key.

2.  **Server Path**:
    Ensure the project is cloned on the server at `/var/www/apms` or update the path in `.github/workflows/deploy.yml`.

3.  **Trigger**:
    Simply push to the `main` branch:
    ```bash
    git add .
    git commit -m "feat: new update"
    git push origin main
    ```
    GitHub will automatically SSH into your server, pull the changes, rebuild the containers, and run migrations.
