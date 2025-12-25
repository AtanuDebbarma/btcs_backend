# BTCST Backend API

Backend middleware layer for Bhavan's Tripura College of Science & Technology website.

## Overview

This Node.js/Express backend serves as a secure middleware between the React frontend and Firebase services, handling authentication, authorization, and sensitive operations.

## Core Responsibilities

- **Authentication**: Validates Firebase ID tokens using Firebase Admin SDK
- **Authorization**: Enforces admin-only access for protected operations
- **Image Management**: Handles Cloudinary uploads, updates, and deletions
- **Data Operations**: Manages CRUD operations for college content (notices, faculty, gallery, etc.)
- **Security**: Rate limiting, CORS configuration, and request validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: Firebase Admin SDK
- **Image Storage**: Cloudinary
- **Security**: Helmet, CORS, Rate Limiting

## Deployment

- **Production**: Vercel (serverless configuration)

## Environment Variables

Required environment variables are documented in `.env.example`. Contact the repository owner for production credentials.

## License

MIT License - See LICENSE file for details.

## 👨‍💻 Author

**Atanu Debbarma**

- GitHub: [@AtanuDebbarma](https://github.com/AtanuDebbarma)
