# NestJS Backend with Firebase Authentication and Optimizations

## Overview

This project leverages Node.js version 20.17.0 and the NestJS framework to build a robust and scalable backend application. It incorporates several key features and integrations to ensure high performance, security, and maintainability.

## Features

- **Swagger Integration**: Provides interactive API documentation for exploring and testing endpoints.
- **Firebase Authentication**: Manages user authentication and access control securely.
- **Global Guards**: Implements custom guards for authorization and request validation.
- **Compression Middleware**: Uses gzip and other algorithms to optimize response payloads.
- **Logging Middleware**: Captures and monitors application activities and errors.
- **Cache Implementation**: Enhances performance with caching mechanisms using `cache-manager`.

## Getting Started

### Prerequisites

- Node.js 20.17.0
- NPM or Yarn

### Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   
2. **Clone the Repository**:
    ```bash
   cd <project-directory>

3. npm install

### Configuration

1. **Create Environment Variables**: Create a .env file in the root directory with the following content:
   ```bash
    FIREBASE_PATH_SERVICE_ACCOUNT=<path-to-your-firebase-service-account-json>
    COMPRESSION_THRESHOLD=<size-in-bytes>
  Replace <path-to-your-firebase-service-account-json> with the path to your Firebase service account JSON file. 
  Set <size-in-bytes> to the minimum size (in bytes) for which responses will be compressed.

   
2. **Firebase Service Account JSON**:
  Ensure that the Firebase service account JSON file is accessible at the path specified in the FIREBASE_PATH_SERVICE_ACCOUNT environment variable.

### Running the Application

1. **Start the Application**:
   ```bash
    npm run start
2. **Access Swagger Documentation**: 
  Navigate to http://localhost:3000/api to view and interact with the API documentation.

## Contributing
  Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes. Follow the project's coding standards and guidelines.

## Contact
For questions or inquiries, please reach out to ammarsattar85@gmail.com
