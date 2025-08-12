# Security Policy

## Sensitive Information Protection

This project contains sensitive API keys and configuration data that must be protected:

### Environment Variables
- **NEVER commit `.env.local` files** - they contain live API keys
- Use `.env.example` as a template for required environment variables
- API keys should be stored in:
  1. Local `.env.local` file (for development)
  2. System environment variables (recommended)
  3. Secure deployment environment variables (for production)

### Required API Keys
- `OPENAI_API_KEY` or `VITE_OPENAI_API_KEY` - OpenAI API access
- `GWDG_API_KEY` or `VITE_GWDG_API_KEY` - GWDG/KISS-KI API access

### Development Setup
1. Copy `.env.example` to `.env.local`
2. Replace placeholder values with your actual API keys
3. Never commit `.env.local` to version control

## Reporting Security Issues

If you discover a security vulnerability, please report it privately to the maintainers.

## Security Best Practices

- Keep dependencies updated
- Never hardcode API keys in source code
- Use environment variables for all sensitive configuration
- Regularly rotate API keys
- Monitor for exposed secrets in commits
