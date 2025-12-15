# Contributing to Code-Reverb

Welcome! We're excited that you're interested in contributing to Code-Reverb, an AI-powered code review platform. This document provides guidelines and information to help you get started.

## Ways to Contribute

There are many ways to contribute to Code-Reverb:

- **🐛 Report Bugs**: Found a bug? [Open an issue](https://github.com/afuhflynn/code-reverb/issues/new?template=bug_report.md)
- **💡 Suggest Features**: Have an idea? [Open a feature request](https://github.com/afuhflynn/code-reverb/issues/new?template=feature_request.md)
- **📝 Improve Documentation**: Help make our docs better
- **🔧 Write Code**: Fix bugs or add features
- **🧪 Add Tests**: Improve our test coverage
- **🎨 Design**: Help with UI/UX improvements

## Development Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+**: [Download here](https://nodejs.org/)
- **pnpm**: Package manager (`npm install -g pnpm`)
- **PostgreSQL**: Database (we recommend Docker)
- **Git**: Version control

### Quick Start

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/code-reverb.git
   cd code-reverb
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   ```

   Fill in the required environment variables (see [Environment Setup](#environment-setup) below).

4. **Set Up the Database**
   ```bash
   # Start PostgreSQL with Docker
   docker-compose up -d postgres

   # Run database migrations
   pnpm prisma migrate dev

   # Generate Prisma client
   pnpm prisma generate
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Setup

You'll need to configure these environment variables in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/code_reverb"

# GitHub OAuth (create at https://github.com/settings/applications/new)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# AI APIs (get from respective providers)
GOOGLE_AI_API_KEY=your_google_ai_key
OPENAI_API_KEY=your_openai_key

# Vector Database (Pinecone)
PINECONE_API_KEY=your_pinecone_key
PINECONE_INDEX_NAME=code-reverb

# Email (optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Inngest (for background jobs)
INNGEST_EVENT_KEY=your_inngest_event_key

# Secrets Management (nvii.dev)
NVII_API_KEY=your_nvii_api_key
```

### Development Workflow

We use several tools to maintain code quality:

```bash
# Run the development server
pnpm dev

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Format code
pnpm format

# Run database studio
pnpm db:studio

# Run Inngest dev server
pnpm inngest:start
```

## Code Style and Conventions

### TypeScript & Code Quality

- **TypeScript**: All code must be fully typed
- **Linting**: We use Biome for fast, reliable linting
- **Formatting**: Code is automatically formatted with Biome
- **Imports**: Use absolute imports with `@/` prefix

### Commit Messages

We follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

Examples:
```
feat(auth): add GitHub OAuth integration
fix(api): handle null user in session validation
docs(readme): update installation instructions
```

### Branch Naming

Use descriptive branch names:
- `feature/add-dark-mode`
- `fix/login-validation`
- `docs/update-contributing-guide`

### Pull Request Guidelines

1. **Create a Feature Branch**: Always create a branch from `main`
2. **Keep PRs Focused**: One feature or fix per PR
3. **Write Clear Descriptions**: Explain what and why
4. **Add Tests**: Include tests for new features
5. **Update Documentation**: Update docs if needed
6. **Run Checks**: Ensure all CI checks pass

### PR Template

When creating a PR, use this template:

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows project conventions
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No linting errors
```

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Guidelines

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and workflows
- **E2E Tests**: Test complete user journeys
- **Test Coverage**: Aim for >80% coverage

### Writing Tests

```typescript
// Component test example
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

- **Clear Title**: Describe the issue concisely
- **Steps to Reproduce**: Numbered steps to reproduce
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, browser, Node version
- **Screenshots**: If applicable
- **Code Snippets**: Minimal reproduction case

### Feature Requests

For feature requests, include:

- **Problem**: What's the problem you're trying to solve?
- **Solution**: Describe your proposed solution
- **Alternatives**: Any alternative solutions considered
- **Use Cases**: Who would use this and how?

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful and inclusive
- Focus on constructive feedback
- Help newcomers learn and contribute
- Report any unacceptable behavior

## Getting Help

- **Documentation**: Check our [docs](https://docs.code-reverb.com)
- **Issues**: Search existing issues first
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord

## Recognition

Contributors are recognized in:
- GitHub's contributor insights
- Release notes
- Our website's contributor page

Thank you for contributing to Code-Reverb! 🚀