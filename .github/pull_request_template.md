## Pull Request Security Checklist

### Description
Brief description of changes

### Security Review
Please confirm the following security requirements have been met:

- [ ] **No secrets in code**: No API keys, passwords, tokens, or other sensitive data committed
- [ ] **Environment variables**: Sensitive configuration moved to environment variables  
- [ ] **Dependencies**: New dependencies reviewed for security vulnerabilities
- [ ] **Input validation**: User inputs properly validated and sanitized
- [ ] **Authentication**: Authentication/authorization logic reviewed if applicable
- [ ] **HTTPS/TLS**: All external communications use HTTPS/TLS
- [ ] **Error handling**: Error messages don't expose sensitive information
- [ ] **Logging**: No sensitive data logged in plain text
- [ ] **Code review**: Code has been reviewed by at least one other developer
- [ ] **Testing**: Security-related functionality has been tested

### Changes Made
- [ ] Backend changes (Node.js/Python)
- [ ] Frontend changes (React/Angular)  
- [ ] Infrastructure changes (Docker/CI/CD)
- [ ] Documentation updates
- [ ] Configuration changes

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Security tests pass (if applicable)
- [ ] Manual testing completed

### Deployment Notes
Any special considerations for deployment?

### Related Issues
Fixes #(issue number)