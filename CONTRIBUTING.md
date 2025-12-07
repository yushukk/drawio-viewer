# Contributing to Draw.io Viewer

First off, thank you for considering contributing to Draw.io Viewer! It's people like you that make this extension better for everyone.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (URLs, file samples, screenshots)
- **Describe the behavior you observed** and what you expected
- **Include browser version and OS information**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any similar features** in other extensions if applicable

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the coding style** of the project
3. **Write clear commit messages**
4. **Test your changes** thoroughly
5. **Update documentation** if needed
6. **Submit a pull request**

## Development Setup

### Prerequisites

- Node.js 18 or higher
- pnpm 8 or higher
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/your-username/drawio-viewer.git
cd drawio-viewer

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run for Firefox
pnpm dev:firefox
```

### Project Structure

```
drawio-viewer/
├── entrypoints/          # Extension entry points
│   ├── content.ts       # Content script (main logic)
│   └── background.ts    # Background service worker
├── utils/               # Utility functions
│   ├── xmlValidator.ts  # XML validation
│   └── renderer.ts      # Rendering logic
├── docs/                # Documentation
├── wxt.config.ts       # WXT configuration
└── package.json        # Project metadata
```

## Coding Guidelines

### TypeScript Style

- Use TypeScript for all new code
- Enable strict mode
- Provide type annotations for function parameters and return values
- Avoid using `any` type

### Code Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Keep lines under 100 characters when possible

### Naming Conventions

- Use `camelCase` for variables and functions
- Use `PascalCase` for classes and types
- Use `UPPER_CASE` for constants
- Use descriptive names that explain intent

### Comments

- Write comments for complex logic
- Use JSDoc for function documentation
- Keep comments up-to-date with code changes

### Example

```typescript
/**
 * Validates if the given content is a valid draw.io XML
 * @param content - The XML content to validate
 * @returns True if valid, false otherwise
 */
function isDrawioXML(content: string): boolean {
  // Check for mxGraphModel tag
  return content.includes('<mxGraphModel');
}
```

## Testing

Before submitting a pull request:

1. **Manual Testing**
   - Test in Chrome/Edge
   - Test in Firefox
   - Test with various draw.io file formats
   - Test on different platforms (GitHub, GitLab, local files)

2. **Build Testing**
   ```bash
   # Build for production
   pnpm build
   pnpm build:firefox
   
   # Create distribution packages
   pnpm zip
   pnpm zip:firefox
   ```

3. **Load and Test**
   - Load the built extension in your browser
   - Verify all features work as expected
   - Check console for errors

## Commit Messages

Write clear and meaningful commit messages:

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant

### Examples

```
Add support for compressed draw.io files

- Implement gzip decompression
- Update XML validator to handle compressed format
- Add tests for compressed file handling

Fixes #123
```

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for new functions
- Update technical documentation in `/docs` if needed
- Include code examples for new features

## Review Process

1. All submissions require review before merging
2. Reviewers may request changes
3. Address feedback promptly and professionally
4. Once approved, maintainers will merge your PR

## Release Process

Maintainers handle releases:

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create GitHub release
4. Publish to Chrome Web Store and Firefox Add-ons

## Questions?

- Open an issue for questions
- Join discussions on GitHub Discussions
- Check existing documentation first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Draw.io Viewer! 🎉
