# Lanka Kitchen API
![Lanka Kitchen Logo](/assets/logo-bg.png)

Lanka Kitchen is an initiative by Team Watchdog to help community kitchens, ration groups, and other mutual aid organizations run their operations smoother and get support from the communities they serve.

# Technical
This project serves data in form of a GraphQL API using `type-graphql`.

## Tech Stack

### Data Storage
- Postgres with Prisma

### 3rd Party Services and APIs
- Sendgrid - Mail delivery
- Google Geocoding API
- AWS S3 — For file storage

## Environment variables
- `DATABASE_URL`: URL with authentication details for your POSTGRESQL instance. (This should go inside `.env` if you're using .env files to set environment variables.)
- `GOOGLE_API_KEY`: Google Developer API Key with the Geocoding API Enabled
- `APP_HOST_URL`: Host URL for the webapp. We use this when directing the users back to the webapp from emails.
- `SENDGRID_API_KEY`: Sendgrid API Key. Sendgrid is used to send authentication emails.
- `JWT_SECRET`: JWT secret to generate JWTs for authentication
- `AWS_ACCESS_KEY_ID`: AWS Access Key ID
- `AWS_SECRET_ACCESS_KEY`: AWS Secret Access Key
- `AWS_DEFAULT_REGION`: AWS Region
- `BUCKET_NAME`: AWS S3 Bucket Name to store files

## Setting up on your local environment
1. Clone this repo on your machine.
2. Setup an instance of Postgres and create a database for the project. If you have Docker and Docker Compose installed, you can run `docker-compose up -d` from the project root directory.
2. Put your `.env` file inside the project root directory or set the environment variables via the terminal.
3. Run `npm install` to install all dependencies
4. Run `prisma migrate run` to setup your POSTGRES database.
5. Run `npm run watch` to start your development server in the watch mode.