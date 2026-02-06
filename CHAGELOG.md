Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog
,
and this project adheres to Semantic Versioning
.

[1.0.0] - 2026-02-06
Added

User registration endpoint

JWT authentication with login endpoint

URL shortening endpoint (/shorten)

Support for automatic slug generation

Support for custom aliases for authenticated users

Alias validation (uniqueness and reserved words)

URL redirection with access counter

Soft delete for URLs

List, update and delete URLs for authenticated users

Swagger API documentation covering all endpoints

Docker and Docker Compose setup

Prisma ORM with MySQL database

Database migrations versioned in the repository

Basic request and error logging

Unit tests for authentication, URL creation and redirection

Architecture diagram and scalability documentation

Step-by-step instructions to run the project locally

Notes

This is the first stable release of the project

The API is stateless and ready for horizontal scaling

The project was designed with extensibility and maintainability in mind

Versioning Strategy

MAJOR: breaking API changes

MINOR: new features without breaking changes

PATCH: bug fixes and internal improvements
