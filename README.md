# Full-Stack Project with Django Backend and React Frontend

This project consists of a Django backend and a React frontend, both running in separate Docker containers. The backend is served on port `8000`, and the frontend is served on port `3000`.

## Prerequisites

Before you begin, ensure that you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started) (for building and running containers)
- [Docker Compose](https://docs.docker.com/compose/install/) (for managing multi-container applications)

## Project Structure

- **`backend/`**: Contains the Django backend application.
- **`frontend/`**: Contains the React frontend application.

## Getting Started

Follow these steps to set up and run the project locally using Docker Compose.

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone git@github.com:ZFCon/notetaker.git
```
```bash
cd notetaker
```
```bash
docker-compose up --build
```

- Frontend: `localhost:3000`
- Backend: `localhost:8000`