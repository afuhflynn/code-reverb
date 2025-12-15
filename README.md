# Code-Reverb

An AI-powered code review platform that integrates with GitHub to provide intelligent, automated code analysis and feedback on pull requests.

## Features

- **AI-Powered Reviews**: Uses Google Gemini and OpenAI models for intelligent code analysis
- **GitHub Integration**: Seamless webhook integration for real-time PR monitoring
- **Custom Personas**: Create AI reviewers with different personalities and expertise
- **Inline Comments**: Post detailed review comments directly on GitHub PRs
- **Analytics Dashboard**: Track review metrics and team performance
- **Role-Based Access**: User, admin, and organization-level permissions
- **Async Processing**: Inngest-powered background job processing
- **Email Notifications**: Configurable notifications for review completion

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **AI**: Google Gemini, OpenAI GPT, Pinecone vector DB
- **Auth**: Better Auth with GitHub OAuth
- **Jobs**: Inngest for background processing
- **Email**: Nodemailer
- **Deployment**: Vercel
- **Secrets**: nvii.dev

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- GitHub OAuth App
- Pinecone account
- Google AI API key
- OpenAI API key
- nvii.dev account

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/afuhflynn/code-reverb.git
   cd code-reverb
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:

   ```env
   # Database

   DATABASE_URL="postgresql://postgres:password@localhost:5439/code_reverb" # Local postgres db - docker container

   # GitHub OAuth

   GITHUB_CLIENT_ID="your_github_client_id"
   GITHUB_CLIENT_SECRET="your_github_client_secret"

   # AI APIs

   GOOGLE_GENERATIVE_AI_API_KEY="your_google_generative_ai_api_key"
   OPENAI_API_KEY="your_openai_api_key"

   # Vector Database (Pinecone)

   PINECONE_API_KEY="your_pinecone_api_key"
   PINECONE_INDEX_NAME="code-reverb"
   PINECONE_ENVIRONMENT="your_pinecone_environment"

   # Email Service (SMTP)

   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="<your_mail_id>"
   SMTP_PASS="your_smt_pass"
   FROM_EMAIL="<from_email>"
   SMTP_USER_NAME="smtp_user_name"

   # Background Jobs (Inngest)

   INNGEST_EVENT_KEY="dev-event-key"
   INNGEST_SIGNING_KEY="dev-signing-key"

   # Secrets Management (nvii.dev)

   NVII_API_KEY="your_nvii_api_key"

   # Arcjet setup

   ARCJET_KEY="your_arcjet_key"

   # Optional: For production

   VERCEL_URL="your_vercel_deployment_url"
   NODE_ENV="development"

   BETTER_AUTH_SECRET="your_better_auth_secret"
   BETTER_AUTH_URL="<http://localhost:3000>" # Base URL of your app

   NEXT_PUBLIC_BASE_URL="<http://localhost:3000>"
   NEXT_PUBLIC_API_BASE_URL="<http://localhost:3000/api>"
   ```

4. **Set up the database**

   ```bash
   # Start PostgreSQL (using Docker)
   docker-compose up -d postgres

   # Run migrations
   pnpm prisma migrate dev

   # Generate Prisma client
   pnpm prisma generate
   ```

5. **Start Inngest (optional for local dev)**

   ```bash
   docker-compose up -d inngest
   ```

6. **Run the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building and Testing

```bash
# Build for production
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Start production server
pnpm start
```

## Project Structure

```txt
code-reverb/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── admin/            # Admin pages
│   ├── repos/            # Repository management
│   ├── personas/         # AI persona management
│   └── (auth)/           # Authentication pages
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn UI components
│   ├── layout/           # Layout components
│   └── dashboard/        # Dashboard-specific components
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication config
│   ├── prisma.ts         # Database client
│   ├── inngest.ts        # Background jobs
│   └── ai/               # AI orchestration
├── prisma/               # Database schema
├── public/               # Static assets
└── inngest/              # Background job functions
```

## Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Configure environment variables** in Vercel dashboard
3. **Set up PostgreSQL** (use Vercel Postgres or external provider)
4. **Deploy**

### Docker Deployment

```bash
# Build and run with Docker
docker-compose up -d
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information on how to get started, development setup, and our contribution process.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs.code-reverb.dev](https://docs.code-reverb.dev)
- **Issues**: [GitHub Issues](https://github.com/your-org/code-reverb/issues)
- **Email**: [Code-Reverb Support](support@code-reverb.dev)
