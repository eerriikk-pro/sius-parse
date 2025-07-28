# Bullseye Score Hub

A modern web application for tracking shooting scores and managing shooting sessions.

## Target Specifications

### 10m Air Pistol Target
- 10 Ring 11.5mm (±0.1mm) 5 Ring 91.5mm (±0.5mm)
- 9 Ring 27.5mm (±0.1mm) 4 Ring 107.5mm (±0.5mm)
- 8 Ring 43.5mm (±0.2mm) 3 Ring 123.5mm (±0.5mm)
- 7 Ring 59.5mm (±0.5mm) 2 Ring 139.5mm (±0.5mm)
- 6 Ring 75.5mm (±0.5mm) 1 Ring 155.5mm (±0.5mm)
- Inner ten: 5.0mm (±0.1mm).
- Black from 7 to 10 rings = 59.5mm (±0.5mm).
- Ring thickness: 0.1mm to 0.2mm.

### 10m Air Rifle Target
- 10 Ring 0.5mm (±0.1mm) 5 Ring 25.5mm (±0.1mm)
- 9 Ring 5.5mm (±0.1mm) 4 Ring 30.5mm (±0.1mm)
- 8 Ring 10.5mm (±0.1mm) 3 Ring 35.5mm (±0.1mm)
- 7 Ring 15.5mm (±0.1mm) 2 Ring 40.5mm (±0.1mm)
- 6 Ring 20.5mm (±0.1mm) 1 Ring 45.5mm (±0.1mm)
- Inner Ten: When the 10 ring (dot) has been shot out completely as determined by the use of an Air Pistol OUTWARD scoring gauge.
- Black from 4 to 9 rings = 30.5mm (±0.1mm).
- The ten ring is a white dot = 0.5mm (±0.1mm). Ring thickness: 0.1mm to 0.2mm.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_REPOSITORY_URL>
cd sius-parse/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run build:dev` - Build the application in development mode
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn/ui** - Modern component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Recharts** - Chart components
- **Lucide React** - Icon library

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── layout/    # Layout components
│   └── ui/        # shadcn/ui components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and API client
├── pages/         # Page components
└── main.tsx       # Application entry point
```

## Development

The project uses modern development tools and practices:

- **ESLint** for code linting
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Vite** for fast development and building

## Deployment

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.
