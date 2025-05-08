# Full Stack Webapp Assignment

A full-stack web application built with **NestJS** (backend) and **React + Vite + shadcn/ui** (frontend).  
Features user authentication, file upload/download, real-time updates via WebSockets, OpenAPI SDK integration, and Google Cloud Storage (GCS) stubs.

---

## Features

- **User Authentication**: JWT-based login with username/password (users stored in JSON).
- **Protected Endpoints**: All file operations require authentication.
- **File Upload & Download**: Upload files to the server and download them from the UI.
- **Real-Time Updates**: WebSocket notifications for file uploads.
- **OpenAPI SDK**: Frontend uses a generated TypeScript SDK for API calls.
- **tRPC Integration**: Demonstrates type-safe backend procedures.
- **Google Cloud Storage (Stub)**: Code is ready for GCS integration (requires billing).
- **Testing Scripts**: Bash scripts for login, protected route access, and file upload.
- **Modern UI**: Built with React, shadcn/ui, and TailwindCSS.

---

## Project Structure

```
fullstack-gcp-webapp/
├── frontend/         # React + Vite + shadcn/ui app
│   └── src/
│       └── sdk/      # OpenAPI-generated TypeScript SDK
├── project1/         # NestJS backend
│   ├── src/
│   │   └── auth/     # Auth, GCS, JWT, WebSocket, tRPC, etc.
│   ├── uploads/      # Uploaded files (local dev)
│   └── scripts/      # Bash scripts for testing
└── instructions/     # Assignment and backend instructions
```

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **Yarn** (preferred) or npm
- **Google Cloud SDK** (optional, for GCS integration)
- **A Google Cloud project** (optional, for full GCS/OAuth integration)

---

## Installation

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd fullstack-gcp-webapp
```

### 2. Backend Setup

```sh
cd project1
yarn install
```

#### (Optional) Google Cloud Setup

- Place your GCS service account JSON somewhere safe.
- Set the environment variable:
  ```sh
  set GOOGLE_APPLICATION_CREDENTIALS=path\to\your\service-account.json
  ```
- Edit `src/auth/gcs.service.ts` and set your bucket name.

### 3. Frontend Setup

```sh
cd ../frontend
yarn install
```

---

## Running the Application

### 1. Start the Backend

```sh
cd project1
yarn start:dev
```
- The backend runs on [http://localhost:3000](http://localhost:3000)
- Swagger docs: [http://localhost:3000/api](http://localhost:3000/api)

### 2. Start the Frontend

```sh
cd ../frontend
yarn dev
```
- The frontend runs on [http://localhost:5174](http://localhost:5174) (or as shown in your terminal)

---

## Usage

1. **Login** with username/password (`user1`/`password1` or `user2`/`password2`).
2. **Upload files** using the UI.
3. **Download files** from the list.
4. **Receive real-time notifications** when files are uploaded (via WebSockets).
5. **Logout** to clear your session.

---

## Testing with Scripts

From `project1/`:

```sh
# Test login
bash scripts/test-login.sh

# Test login and access protected route
bash scripts/login-and-access-protected.sh

# Test file upload
bash scripts/upload-file.sh path/to/your/file.txt
```

---

## Google Cloud Integration

- The codebase includes stubs for Google Cloud Storage and Secret Manager.
- **Live GCS upload/listing requires:**
  - A valid GCP project with billing enabled
  - A service account with Storage permissions
  - The `GOOGLE_APPLICATION_CREDENTIALS` environment variable set
  - Your bucket name set in `src/auth/gcs.service.ts`
- **Note:** If you do not have billing enabled, uploads will be stored locally in the `uploads/` folder.

---

## Architecture Overview

- **Backend:** NestJS, JWT Auth, Multer for uploads, OpenAPI (Swagger), tRPC, Socket.IO for WebSockets.
- **Frontend:** React + Vite, shadcn/ui, OpenAPI-generated SDK, Socket.IO client.
- **Testing:** Bash scripts for API and file upload testing.
- **Extensibility:** Ready for Google OAuth, GCS, and Secret Manager integration.

---

## Limitations & Notes

- **Google Cloud features** (OAuth, GCS, Secret Manager) are stubbed and ready for integration, but not live unless you provide credentials and enable billing.
- **User data** is stored in a JSON file for demo purposes.
- **No production hardening** (e.g., rate limiting, advanced error handling) is included.
- **tRPC** is included as a minimal demonstration.

---

## Further Improvements

- Enable Google OAuth and GCS by providing credentials and enabling billing.
- Add image processing (e.g., thumbnail generation) via Cloud Functions.
- Enhance UI with drag-and-drop, progress bars, and gallery views.
- Add more robust error handling and edge case coverage.


