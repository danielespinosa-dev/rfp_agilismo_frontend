# SostenIA Comfama Angular Project

## Overview
SostenIA Comfama is an Angular application designed to facilitate the registration and management of sustainability evaluations for suppliers. The application leverages a Python backend to handle data processing and service requests.

## Project Structure
The project is organized as follows:

```
SostenIA-angular
├── src
│   ├── app
│   │   ├── components
│   │   │   ├── sidebar
│   │   │   ├── bienvenida
│   │   │   ├── registro
│   │   │   ├── estado
│   │   │   └── informe
│   │   ├── services
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.module.ts
│   ├── assets
│   │   └── styles
│   │       └── main.css
│   └── index.html
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Components
- **SidebarComponent**: Manages navigation between different sections of the application.
- **BienvenidaComponent**: Displays the welcome message and application information.
- **RegistroComponent**: Handles the registration of new requests, including file uploads.
- **EstadoComponent**: Allows users to check the status of their requests.
- **InformeComponent**: Displays the review report for selected providers.

## Services
- **SolicitudService**: Manages HTTP requests related to the submission and retrieval of requests.
- **InformeService**: Handles HTTP requests for fetching reports.

## Styles
Global styles are defined in `src/assets/styles/main.css`, while component-specific styles are located within their respective component directories.

## Backend
The backend is implemented in Python and exposes RESTful services for the Angular application to consume. Ensure that the backend is running and accessible for the application to function correctly.

## Getting Started
1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using:
   ```
   npm install
   ```
4. Start the development server:
   ```
   ng serve
   ```
5. Open your browser and navigate to `http://localhost:4200`.

## License
This project is licensed under the MIT License. See the LICENSE file for details.