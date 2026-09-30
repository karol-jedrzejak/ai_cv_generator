# AI CV Generator

## Tech Stack
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![NextJs](https://img.shields.io/badge/NextJs-000000?style=flat&logo=next,js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) ![API](https://img.shields.io/badge/API-REST-0A66C2?style=flat) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

## Description

AI-powered CV generator that creates a tailored CV and cover letter based on the user's profile and a selected job offer.

### Frontend

- Next.js
- TypeScript
- Material UI (MUI)

### Backend

- NestJS
- TypeScript
- Prisma
- Zod

### Database

- PostgreSQL
- pgAdmin (development only)

### Infrastructure & AI

- Ollama / local LLM
- Docker / Docker Compose
- Concurrently

### Workflow

1. User fills in their profile
        ↓
2. NestJS saves profile to PostgreSQL
        ↓
3. User selects CV template
        ↓
4. User provides job offer URL or text
        ↓
5. NestJS sends profile + job offer to Ollama
        ↓
6. Ollama generates structured JSON
        ↓
7. Backend validates JSON with Zod
        ↓
8. Frontend displays CV preview
        ↓
9. User can edit the generated CV
        ↓
10. User accepts the CV
        ↓
11. Backend generates PDF

## Running the application

### Services & Ports

| Service | Address | Purpose |
|---|---|---|
| Next.js | `http://localhost:3000` | Frontend |
| NestJS | `http://localhost:3001` | Backend API |
| PostgreSQL | `localhost:5432` | Database |
| pgAdmin | `http://localhost:5050` | Database management |
| Ollama | `http://localhost:11434` | Local AI |

### Prerequisites
Before launching the project, make sure you have installed:
* **Nest.js**
* **Docker** (and the Docker Desktop service / daemon running)

###  Installation
After download please startup docker and then run below commands in order.

Windows:
```bash
npm run install
npm run setup
```

Linux\OS
```bash
npm run install
npm run setup
```

### Startup
To launch the application, run the command in the terminal.:

```bash
npm run dev-all
```

Or if docker and containers are already running:

```bash
npm run dev
```




