## Project Overview

This project is a URL shortener API built with NestJS, Prisma and MySQL.

The system allows users to generate shortened URLs, optionally using custom aliases when authenticated. Each access to a shortened URL is tracked, enabling basic analytics such as access count.

The application follows a layered architecture, separating controllers, business logic and data access. It was designed with scalability in mind, making it easy to evolve into a distributed or cloud-based architecture if needed.

The API is fully documented using Swagger and can be executed locally using Docker and Docker Compose.

## 🏗 Architecture

The application follows a layered architecture with clear separation of responsibilities, ensuring maintainability and scalability.

![Architecture Diagram](./docs/architecture.png)

### Flow

1. The client (browser or Postman) sends HTTP requests to the API.
2. Controllers handle routing and request validation.
3. Services contain the business logic.
4. Prisma ORM manages database interactions.
5. Data is persisted in a MySQL database.

### Components

- **Client (Browser / Postman)**  
  Responsible for sending HTTP requests.

- **NestJS API**
  - Controllers
  - Services
  - Prisma ORM

- **MySQL Database**
  - Users
  - URLs

## Scalability & Design Decisions

This project was designed with scalability in mind, even though it currently runs as a single API instance.

### Stateless API

The application is stateless. Authentication is handled via JWT, which allows horizontal scaling without the need for shared session storage.

### Vertical Scaling

The system can scale vertically by increasing CPU, memory, and I/O resources of the API or database instances.  
This approach is suitable for early growth stages and requires no changes to the application code.

### Database Layer

MySQL is used as the primary database with Prisma as the ORM.  
Indexes on frequently accessed fields (such as `slug`) allow efficient lookups during redirection, which is the most critical path in the system.

The database can be scaled vertically or migrated to managed solutions such as Amazon RDS without changes to the application code.

### Horizontal Scaling

Because the API is stateless, multiple instances can be deployed behind a load balancer (e.g. Nginx, AWS ALB, or similar).  
This enables horizontal scaling to handle higher traffic volumes.

### Caching Strategy (Future Improvement)

A cache layer (such as Redis) can be introduced to store frequently accessed slugs, reducing database reads during redirection and improving response times.

### Observability

Basic logging is implemented to track errors and requests.  
This can be extended with centralized logging and monitoring tools (e.g. ELK stack, Prometheus, Grafana) in a production environment.

### Future Evolution ### Future Evolution

The architecture allows future improvements such as:

- Rate limiting per IP or user
- Background jobs for analytics
- Read replicas for the database
- Separation of the redirect flow into a dedicated service

###▶️ Future Evolution
🐳 Running with Docker (Recommended)
Prerequisites

Docker

Docker Compose

Steps

Clone the repository
git clone <repository-url>
cd teddy-url-shortener

Start the application
docker compose up --build

The API will be available at:

API: http://localhost:3000

Swagger Docs: http://localhost:3000/docs

No .env file is required when running with Docker.

💻 Running Locally (Without Docker)
Prerequisites

Node.js 20+

MySQL running locally

Steps

Install dependencies
npm install

Create environment file
cp .env.example .env

Configure database connection
DATABASE_URL="mysql://root:root@localhost:3306/teddy"

Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate deploy

Start the API
npm run start:dev

🧪 Running Tests

npm run test

🧹 Stopping the Containers

docker compose down

To remove volumes (reset database):

docker compose down -v

📚 API Documentation

Swagger documentation is available at:

http://localhost:3000/docs

It provides detailed information about endpoints, request bodies, authentication and responses.

✅ Notes for Evaluators

Docker-first setup for easy execution

No manual environment configuration required

Clear commit history with incremental improvements

Focus on clean architecture and real-world practices

Swagger included for API explorationf
