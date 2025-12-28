# CodeReverb

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/afuhflynn/code-reverb.svg)](https://github.com/afuhflynn/code-reverb/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/afuhflynn/code-reverb.svg)](https://github.com/afuhflynn/code-reverb/issues)

**CodeReverb** is an open-source, AI-powered code review platform.

The full codebase is available under the **MIT License** on GitHub: [https://github.com/afuhflynn/code-reverb](https://github.com/afuhflynn/code-reverb)

A managed, hosted version is available at **[https://code-reverb.dev](https://code-reverb.dev)** for teams that prefer not to self-host.

---

## Why CodeReverb?

Code reviews are slow, inconsistent, and often skipped under pressure. CodeReverb automates first-pass reviews using configurable AI personas while keeping humans in control.

You can self-host CodeReverb for free or use the hosted service to offload infrastructure, AI inference, indexing, and updates.

---

## Features

* **AI-Powered Reviews**: Uses Google Gemini and OpenAI models for intelligent code analysis
* **GitHub Integration**: Real-time PR monitoring via GitHub webhooks
* **Custom Personas**: Create AI reviewers with different personalities and expertise
* **Inline Comments**: Post detailed review comments directly on GitHub PRs
* **Analytics Dashboard**: Track review metrics and team performance
* **Role-Based Access**: User, admin, and organization-level permissions
* **Async Processing**: Inngest-powered background job execution
* **Email Notifications**: Configurable notifications for reviews, failures, and security events

---

## Tech Stack

* **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Shadcn UI
* **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
* **AI**: Google Gemini, OpenAI GPT, Pinecone vector database
* **Auth**: Better Auth with GitHub OAuth
* **Jobs**: Inngest
* **Email**: Nodemailer (SMTP)
* **Deployment**: Vercel, Docker
* **Secrets**: nvii.dev

---

## Getting Started

### Prerequisites

* Node.js 18+
* PostgreSQL
* GitHub OAuth App
* Pinecone account
* Google AI API key
* OpenAI API key
* nvii.dev account

---

### Quick Self-Host (Docker)

```bash
git clone https://github.com/afuhflynn/code-reverb.git
cd code-reverb
cp .env.example .env
# Fill in required API keys and secrets

docker-compose up -d --build
pnpm prisma migrate deploy
pnpm prisma generate
pnpm dev
```

---

### Local Development

1. **Install dependencies**

```bash
pnpm install
```

2. **Set up environment variables**

```bash
cp .env.example .env.local
```

Key variables:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5439/code_reverb

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
OPENAI_API_KEY=your_openai_key

PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=CodeReverb

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
FROM_EMAIL=notifications@code-reverb.dev

INNGEST_EVENT_KEY=dev-event-key
INNGEST_SIGNING_KEY=dev-signing-key

NVII_API_KEY=your_nvii_key
ARCJET_KEY=your_arcjet_key

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. **Database setup**

```bash
docker-compose up -d postgres
pnpm prisma migrate dev
pnpm prisma generate
```

4. **Run the app**

```bash
pnpm dev
```

---

## Project Structure

```txt
CodeReverb/
├── app/            # Next.js app directory
├── components/     # UI components
├── lib/            # Core libraries (auth, prisma, inngest, ai)
├── prisma/         # Database schema
├── public/         # Static assets
├── inngest/        # Background jobs
└── docs/           # Documentation
```

---

## Deployment

### Vercel

1. Connect the GitHub repository
2. Configure environment variables
3. Set up PostgreSQL
4. Deploy

### Docker

```bash
docker-compose up -d
```

---

## Security

If you discover a security vulnerability, please report it privately to **[security@code-reverb.dev](mailto:security@code-reverb.dev)**.

Do not disclose security issues publicly.

---

## Contributing

Contributions are welcome. Please read **CONTRIBUTING.md** and **CODE_OF_CONDUCT.md** before submitting issues or pull requests.

---

## Community

* GitHub Issues: [https://github.com/afuhflynn/code-reverb/issues](https://github.com/afuhflynn/code-reverb/issues)
* Discussions: [https://github.com/afuhflynn/code-reverb/discussions](https://github.com/afuhflynn/code-reverb/discussions)
* Discord: [https://discord.gg/code-reverb](https://discord.gg/code-reverb)

---

## Support

* Documentation: [https://docs.code-reverb.dev](https://docs.code-reverb.dev)
* Issues: [https://github.com/afuhflynn/code-reverb/issues](https://github.com/afuhflynn/code-reverb/issues)
* Email: [support@code-reverb.dev](mailto:support@code-reverb.dev)

---

## License

This project is licensed under the MIT License. See **LICENSE** for details.

Built in public. Community-driven. Opinionated by design.
