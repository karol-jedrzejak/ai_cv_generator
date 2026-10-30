# AI CV Generator

<img src="https://raw.githubusercontent.com/karol-jedrzejak/ai_cv_generator/refs/heads/main/screenshots/01.png" height="400">
<img src="https://raw.githubusercontent.com/karol-jedrzejak/ai_cv_generator/refs/heads/main/screenshots/02.png" height="400">

AI CV Generator is a web application for organizing a professional profile and creating job-specific CVs and cover letters. It combines a Next.js frontend, a NestJS REST API, PostgreSQL, Prisma, and configurable AI providers.

The application uses a candidate's saved profile and a job offer to produce structured documents in Polish or English. Users can choose between a locally hosted Ollama model and Google AI Studio (Gemini).

## What the application does

- Provides account registration, login, and JWT-protected dashboard features.
- Lets users maintain a reusable career profile, including:
  - Contact details and a profile photo.
  - Social links, technology skills, and language skills.
  - Work experience, projects, education, courses, and certifications.
- Lets users save and manage job offers, including a description and an optional URL.
- Can retrieve readable text from a supplied job-offer URL before generation.
- Generates a tailored CV or cover letter in a selected language.
- Renders generated documents in an A4-oriented layout in the frontend.
- Stores generated documents so users can return to them later.
- Lets each user select the AI provider used for generation in their profile settings.

Generated documents are starting points, not a substitute for review. Check names, dates, claims, language, and formatting before using a document in an application.

## How AI generation works

1. A user completes their profile and saves a job offer.
2. The backend loads the user's profile and the selected job offer. If the offer has a URL, the backend attempts to extract text from the page.
3. The backend formats the relevant profile and offer information into a compact text prompt and adds document-specific instructions.
4. The selected provider generates structured JSON for the CV or cover letter.
5. Gemini receives a JSON response schema through Google's Gen AI SDK. Ollama receives the expected output structure as part of its prompt.
6. The backend validates and normalizes the model output, then stores the generated document in PostgreSQL.
7. The frontend displays the saved document in an A4-oriented view.

The CV instructions request concise content intended to fit on one A4 page. Cover-letter instructions ask for body paragraphs without a recruiter greeting or a closing signature.

### AI providers

#### Ollama (local)

The default configuration uses `qwen2.5:7b`, served by Ollama in Docker. The model runs on the machine hosting the Ollama service; it may require substantial memory and processing resources. The backend's Ollama URL, model, and timeout can be configured with environment variables.

#### Google AI Studio (Gemini)

The backend uses Google's official `@google/genai` SDK and the Interactions API. The model name, API key, and timeout are configurable. Gemini is asked to return data matching the CV or cover-letter JSON schema.

Each user can select the provider in their profile settings. A provider must be running and correctly configured for generation to work.

## Technology stack

| Area | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript, Material UI |
| Backend | NestJS, TypeScript, Prisma, Zod |
| Database | PostgreSQL |
| Authentication | JWT |
| AI | Ollama, Google AI Studio (Gemini) |
| Development infrastructure | Docker Compose, pgAdmin |

## Prerequisites

- Node.js and npm.
- Docker Desktop (or Docker Engine with Docker Compose).
- Sufficient system resources for the Ollama model if using the local provider.
- A Google AI Studio API key if using Gemini.

## Getting started

Run commands from the repository root.

1. Install the root development dependencies and initialize the project:

   ```bash
   npm install
   npm run setup
   ```

   Setup creates `.env` from `.env.example` if it does not already exist, installs the backend and frontend dependencies, starts the Docker Compose services, and downloads `qwen2.5:7b` into Ollama.

2. Review the generated root `.env`:

   - Set `DATABASE_URL` to the PostgreSQL instance and database configured by `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`.
   - Keep `OLLAMA_URL` and `OLLAMA_MODEL` aligned with the Ollama service and the model you have installed.
   - To use Gemini, set `GOOGLE_AI_STUDIO_API_KEY` to your own key and choose an available `GOOGLE_AI_STUDIO_MODEL`.
   - Do not commit `.env` or expose API keys.

3. Apply the database migrations and optionally load the example seed data:

   ```bash
   cd backend
   npm exec prisma migrate dev
   npm exec prisma db seed
   cd ..
   ```

   The seed includes a demo user and example profile data. Use it only in a local development database.

4. Start the frontend and backend:

   ```bash
   npm run dev-all
   ```

   This starts Docker infrastructure and runs the web application. If the containers are already running, use:

   ```bash
   npm run dev
   ```

The frontend API client defaults to `http://localhost:3001`. To override it, configure `NEXT_PUBLIC_API_URL` in the frontend environment.

## Local service addresses

| Service | Address | Purpose |
|---|---|---|
| Frontend | `http://localhost:3000` | Web application |
| Backend | `http://localhost:3001` | REST API |
| PostgreSQL | `localhost:5432` | Application database |
| pgAdmin | `http://localhost:5050` | Development database administration |
| Ollama | `http://localhost:11434` | Local AI model service |

Ports and credentials for the Docker services are configured in the root `.env` file.

## Useful commands

| Command | Description |
|---|---|
| `npm run dev-all` | Start Docker services and run the frontend and backend |
| `npm run dev` | Run the frontend and backend when infrastructure is already running |
| `npm run dev-frontend` | Run only the Next.js frontend |
| `npm run dev-backend` | Run only the NestJS backend |
| `npm run dev-infrastructure` | Start Docker Compose services |
| `npm run prisma:generate` | Generate the Prisma client |
| `npm run prisma:migrate` | Create/apply development migrations |
| `npm run prisma:db-seed` | Load example database data |
| `npm run prisma:reset` | Reset the development database and reseed it |
| `npm run build --prefix backend` | Build the backend |
| `npm run build --prefix frontend` | Build the frontend |

## Repository layout

```text
backend/
  prisma/                 Prisma schema, migrations, and seed data
  src/
    auth/                 Registration, login, and JWT authentication
    users/                Profile and avatar management
    job-offers/           Job offers and generated CVs/cover letters
    ai-provider/          AI provider selection and Gemini integration
    ollama/               Ollama integration
    ...                   Profile sections and REST API modules
frontend/
  src/app/                Next.js routes and dashboard pages
  src/components/         Shared and document-rendering components
  src/lib/api/            Frontend API clients
  src/types/              Frontend data types
docker-compose.yaml       PostgreSQL, pgAdmin, and Ollama services
```

## Privacy and AI usage

Generation sends profile information and job-offer content to the provider selected by the user. With Ollama, the request goes to the configured Ollama service. With Google AI Studio, the request is sent to Google's API; review Google's terms and privacy practices before sending personal data.

For troubleshooting, the backend also writes AI request snapshots under `backend/data/ollama-requests/` or `backend/data/google-ai-studio-requests/`, separated into CV and cover-letter folders. These files can contain personal profile and job-offer information. Treat them as sensitive, do not commit them, and remove them when they are no longer needed.

Use example or synthetic profile data during development. Protect the database, environment files, uploaded photos, and request logs from unauthorized access.

## AI-assisted development

AI tools were also used during the development of this application to assist with implementation, code refinement, and problem-solving. AI assistance was part of the development workflow; it does not replace human review, testing, or responsibility for the code and generated documents.
