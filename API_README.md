# Simplex Finance - Linear Optimization Tool

A web application for solving linear programming problems using the simplex method. This project consists of a FastAPI backend and a React frontend with TypeScript.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Frontend Documentation](#frontend-documentation)
- [Development Workflow](#development-workflow)
- [API Client Generation](#api-client-generation)
- [Features](#features)
- [Troubleshooting](#troubleshooting)

## Project Overview

Simplex Finance is a professional web application that helps users solve linear programming optimization problems. The application supports both maximization (profits) and minimization (costs/losses) problems with an intuitive interface and real-time API status monitoring.

## Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Uvicorn** - ASGI server for running FastAPI
- **Pydantic V2** - Data validation using Python type annotations
- **NumPy** - Numerical computing for simplex algorithm

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - React component library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## Project Structure

```
d:\GFB\projet\
├── api/
│   └── main.py                    # FastAPI application with endpoints and validation
├── simplex_solve.py               # Simplex algorithm implementation
├── start_api.py                   # Script to start the API server
├── requirements.txt               # Python dependencies
├── package.json                   # Node.js dependencies and scripts
├── generate-api-client.ps1        # PowerShell script for client generation
├── generate-api-client.sh         # Bash script for client generation
├── src/
│   ├── components/
│   │   ├── AppHeader.tsx         # Header with API status indicator
│   │   ├── Stepper.tsx           # Progress stepper component
│   │   ├── EquationBuilder.tsx   # Constraint equation builder
│   │   ├── CanonicalPreview.tsx  # Canonical form preview
│   │   └── ThemeToggle.tsx       # Dark/light mode toggle
│   ├── pages/
│   │   ├── Index.tsx             # Landing page
│   │   ├── Setup.tsx             # Problem configuration page
│   │   └── SolveResult.tsx       # Results display page
│   └── lib/
│       ├── api-client.ts         # TypeScript API client wrapper
│       ├── api-generated/        # Auto-generated API client
│       ├── api-status-store.ts   # API connection status store
│       ├── problem-store.ts      # Problem state management
│       └── simplex-types.ts      # TypeScript type definitions
└── API_README.md                 # This file
```

## Prerequisites

- **Python 3.8+** - For the backend
- **Node.js 18+** - For the frontend
- **npm** or **yarn** - Package manager for Node.js

## Installation

### Backend Setup

1. Navigate to the project directory:
```bash
cd d:\GFB\projet
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

### Frontend Setup

1. Install Node.js dependencies:
```bash
npm install
```

## Running the Application

### Starting the Backend

**Option 1: Using the start script (Recommended)**
```bash
python start_api.py
```

**Option 2: Using uvicorn directly**
```bash
uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

### Starting the Frontend

In a separate terminal:
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

### Accessing the Application

Open your browser and navigate to `http://localhost:8080`

## API Documentation

### Endpoints

#### GET `/`
Root endpoint with API information.

#### GET `/health`
Health check endpoint. Returns `{"status": "ok"}` if the API is running.

#### POST `/solve`
Solves a linear programming problem using the simplex method.

**Request Body:**
```json
{
  "objective_type": "max" | "min",
  "num_variables": 1-10,
  "objective_coefficients": [number, ...],
  "constraints": [
    {
      "coeffs": { "x1": number, "x2": number, ... },
      "type": "<=" | ">=" | "=",
      "b": number
    }
  ]
}
```

**Response:**
```json
{
  "variables": { "x1": number, "x2": number, ... },
  "z": number,
  "success": boolean,
  "message": string
}
```

### Interactive Documentation

Once the API is running, access:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Input Validation

**Backend (Pydantic V2):**
- `objective_type`: Must be "max" or "min"
- `num_variables`: Between 1 and 10
- `objective_coefficients`: Must match num_variables count
- `constraints`: At least one constraint required
- `b` (RHS): Must be positive

**Frontend (TypeScript):**
- All coefficients must be filled
- Values must be valid numbers
- RHS must be positive
- Real-time validation before submission

## Frontend Documentation

### State Management

The application uses Zustand for state management:

- **problem-store.ts**: Manages problem configuration (objective type, variables, constraints)
- **api-status-store.ts**: Manages API connection status with automatic health checks

### API Status Monitoring

The application includes real-time API status monitoring:
- **Connected** (green dot): API is responding
- **Disconnected** (red dot): API is not responding
- **Loading** (gray dot): Checking connection status
- **Error** (orange dot): Connection error occurred

The status is checked:
- On page load
- Every 30 seconds automatically
- Before each solve request

### Error Handling

The application provides user-friendly error messages:
- **Service unavailable**: Shows a clear message when the API is down
- **Toast notifications**: Display errors with appropriate icons
- **Retry button**: Allows users to manually retry connection

### Business Semantics

The application uses clear business terminology:
- **MAX**: "Maximize profits" - For maximizing revenue, profits, or returns
- **MIN**: "Minimize losses" - For minimizing costs, expenses, or losses

Results display context-specific labels:
- MAX mode: "Optimal profit" with "profit units"
- MIN mode: "Minimal losses" with "cost units"

## Development Workflow

### Making Changes to the Backend

1. Edit files in the `api/` directory or `simplex_solve.py`
2. The API will auto-reload if using `--reload` flag
3. If you modify the API schema, regenerate the TypeScript client (see below)

### Making Changes to the Frontend

1. Edit files in the `src/` directory
2. Vite provides hot module replacement (HMR)
3. Changes will reflect immediately in the browser

### Code Style

- **Python**: Follow PEP 8 guidelines
- **TypeScript**: Use ESLint and Prettier for consistent formatting
- **Components**: Use functional components with hooks

## API Client Generation

The TypeScript client is automatically generated from the FastAPI OpenAPI schema using `openapi-typescript-codegen`.

### When to Regenerate

Regenerate the TypeScript client when:
- API endpoint signatures change
- Request/response models are modified
- New endpoints are added
- Validation rules are updated

### Regeneration Steps

1. **Ensure the API is running** on `http://localhost:8000`
2. Run one of the following commands:

```bash
# Using npm script (recommended)
npm run generate-api-client

# Using PowerShell (Windows)
powershell -ExecutionPolicy Bypass -File generate-api-client.ps1

# Using Bash (Linux/Mac)
bash generate-api-client.sh
```

The generated client will be in `src/lib/api-generated/`

### Client Structure

- `api-client.ts`: Wrapper around the generated client with error handling
- `api-generated/`: Auto-generated code including:
  - Types for all API models
  - `DefaultService` with methods for each endpoint
  - HTTP request/response handling

## Features

### Core Features
- **Linear programming solver** using the simplex method
- **Support for MAX and MIN** optimization problems
- **Up to 10 decision variables**
- **Multiple constraints** with <=, >=, and = operators
- **Real-time validation** of inputs
- **Interactive equation builder** for constraints

### UX Features
- **Real-time API status monitoring**
- **User-friendly error messages**
- **Dark/light mode** support
- **Responsive design** for all screen sizes
- **Professional UI** with shadcn/ui components
- **Toast notifications** for user feedback

### Developer Features
- **Type-safe** TypeScript integration
- **Auto-generated API client** from OpenAPI schema
- **Hot module replacement** for fast development
- **CORS configuration** for development
- **Comprehensive validation** on both frontend and backend

## Troubleshooting

### Common Issues

**Error: "ModuleNotFoundError: No module named 'numpy'"**
```bash
pip install --only-binary :all: numpy
```

**Error: "API not available" or CORS errors**
- Ensure the backend is running on `http://localhost:8000`
- Check that CORS origins in `api/main.py` include your frontend URL
- Default allowed origins: `http://localhost:5173`, `http://localhost:3000`, `http://localhost:8080`

**Port already in use (8000 or 8080)**
```bash
# Windows - Find process using port
netstat -ano | findstr :8000

# Kill the process
taskkill /F /PID <PID>
```

**Frontend not reflecting changes**
- Clear browser cache
- Restart the dev server: `npm run dev`
- Check for console errors in browser DevTools

**API health check failing**
- Verify the API is running
- Check firewall settings
- Ensure no proxy is blocking localhost connections

### Getting Help

If you encounter issues:
1. Check the browser console for JavaScript errors
2. Check the terminal for Python errors
3. Verify all dependencies are installed
4. Ensure both backend and frontend are running
5. Check that ports 8000 and 8080 are available

## License

This project is proprietary and confidential.

## Contact

For questions or support, please contact the development team.
