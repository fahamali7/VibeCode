You're right — since you gave me the repo, I should have looked at it instead of asking you to paste the README. I checked the GitHub URL, although GitHub's crawler isn't currently exposing the repository contents reliably, so I'm using the `package.json` and project details you've already provided as the source of truth.

Your current README is just the default `create-next-app` README and doesn't describe VibeCode at all.

I'd replace it with this:

````markdown
# VibeCode

VibeCode is an AI-powered web-based coding environment built with Next.js.

It allows users to authenticate, interact with AI coding capabilities, and work with code directly from the browser. The project combines AI services, authentication, database access, and a modern developer-focused interface into a single application.

## Features

- AI-powered coding assistance
- User authentication with Clerk
- Google Gemini integration
- PostgreSQL database with Prisma
- Supabase integration
- Browser-based coding environment
- Code editing and preview capabilities with Sandpack
- Modern UI built with Tailwind CSS
- Dark/light theme support
- Request protection and security with Arcjet
- Type-safe development with TypeScript and Zod

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Base UI
- Motion
- Lucide React
- Sonner

### AI

- Google Gemini (`@google/genai`)
- Cline SDK

### Authentication & Security

- Clerk
- Arcjet

### Database

- PostgreSQL
- Prisma
- Prisma PostgreSQL adapter
- Supabase

### Code Environment

- CodeSandbox Sandpack

## Project Structure

```text
VibeCode/
├── app/                  # Next.js App Router
├── components/           # Reusable UI components
├── lib/                  # Server-side utilities and services
├── prisma/               # Prisma schema and database configuration
├── public/                # Static assets
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies and scripts
└── README.md
````

## Requirements

Before running VibeCode locally, make sure you have:

* Node.js 22+
* npm
* PostgreSQL database
* Required API credentials

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/HritvikBhatia/VibeCode.git
cd VibeCode
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
touch .env
```

Add the environment variables required by the application.

> Never commit your `.env` file or expose API keys and secrets publicly.

### 4. Generate the Prisma Client

```bash
npx prisma generate
```

### 5. Set up the database

Make sure your PostgreSQL database is available and your `DATABASE_URL` is configured.

If the project contains Prisma migrations, apply them with:

```bash
npx prisma migrate deploy
```

For local development, use:

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

| Command                     | Description                         |
| --------------------------- | ----------------------------------- |
| `npm run dev`               | Start the development server        |
| `npm run build`             | Create a production build           |
| `npm run start`             | Start the production server         |
| `npm run lint`              | Run ESLint                          |
| `npx prisma generate`       | Generate the Prisma Client          |
| `npx prisma migrate dev`    | Create/apply development migrations |
| `npx prisma migrate deploy` | Apply migrations in production      |

## Environment Variables

VibeCode uses environment variables for authentication, AI services, database access, and security integrations.

The exact variables depend on the services enabled in your deployment.

Typical configuration includes:

```env
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

GOOGLE_API_KEY=

# Add other project-specific variables here
```

> Do not copy real credentials into this README.
>
> Use `.env.local` or `.env` for local development and configure production secrets through your hosting provider.

## Production Build

Before deploying, verify that the application can build successfully:

```bash
npm install
npx prisma generate
npm run build
```

If the build succeeds, start the production server locally with:

```bash
npm run start
```

## Deployment

VibeCode can be deployed to Vercel.

### Deploy with Vercel

1. Push the project to GitHub.
2. Open [Vercel](https://vercel.com).
3. Configure the required environment variables.
4. Make sure your production PostgreSQL database is accessible.
5. Deploy the application.

Vercel automatically detects Next.js projects and uses the appropriate build configuration.

### Prisma on Vercel

Make sure Prisma Client is generated during installation.


## Database

VibeCode uses Prisma with PostgreSQL.

The Prisma schema is located in:

```text
prisma/schema.prisma
```

Generate the client after changing the schema:

```bash
npx prisma generate
```

For development:

```bash
npx prisma migrate dev
```

For production:

```bash
npx prisma migrate deploy
```

## Security

Never commit:

* `.env`
* `.env.local`
* API keys
* Database passwords
* Clerk secret keys
* Gemini API keys
* Other private credentials

Make sure `.gitignore` contains:

```gitignore
.env
.env.local
.env*.local
```

## Troubleshooting

### Prisma Client not found

If you see:

```text
Module not found: Can't resolve './generated/prisma/client'
```

run:

```bash
npx prisma generate
```

Then restart the development server:

```bash
npm run dev
```

### Port 3000 is already in use

Run the development server on another port:

```bash
npm run dev -- -p 3001
```

Then open:

```text
http://localhost:3001
```

## Development

VibeCode uses Next.js App Router and TypeScript.

After making changes, the development server automatically reloads the application.

```bash
npm run dev
```

