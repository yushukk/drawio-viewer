# Draw.io Viewer Browser Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WXT](https://img.shields.io/badge/Built%20with-WXT-blue)](https://wxt.dev)

A privacy-focused browser extension that renders draw.io diagram files locally in your browser without sending data to external servers.

## ✨ Features

- 🔒 **Privacy First**: All rendering happens locally - no data sent to external servers
- 🚀 **Fast & Lightweight**: Instant diagram rendering using draw.io's official viewer
- 🌐 **Cross-Browser**: Works on Chrome, Firefox, and other Chromium-based browsers
- 📁 **Multiple Formats**: Supports `.drawio`, `.drawio.xml`, and `.dio` files
- 🎯 **Smart Detection**: Automatically detects draw.io files on GitHub, GitLab, and other platforms
- 💻 **Offline Capable**: Works completely offline once installed

## 🎯 Use Cases

- View draw.io diagrams directly on GitHub/GitLab without downloading
- Preview draw.io files from local file system
- Render diagrams from any URL containing draw.io XML content
- Quick diagram viewing without opening the full draw.io application

## 📦 Installation

### From Chrome Web Store (Coming Soon)
*Extension will be available on Chrome Web Store soon*

### From Firefox Add-ons (Coming Soon)
*Extension will be available on Firefox Add-ons soon*

### Manual Installation (Development)

1. Clone this repository:
```bash
git clone https://github.com/yourusername/drawio-viewer.git
cd drawio-viewer
```

2. Install dependencies:
```bash
pnpm install
```

3. Build the extension:
```bash
# For Chrome/Edge
pnpm build

# For Firefox
pnpm build:firefox
```

4. Load the extension:
   - **Chrome/Edge**: 
     1. Open `chrome://extensions/`
     2. Enable "Developer mode"
     3. Click "Load unpacked"
     4. Select the `.output/chrome-mv3` directory
   
   - **Firefox**:
     1. Open `about:debugging#/runtime/this-firefox`
     2. Click "Load Temporary Add-on"
     3. Select any file in the `.output/firefox-mv3` directory

## 🚀 Usage

1. Install the extension in your browser
2. Navigate to any `.drawio` file URL (e.g., GitHub raw file)
3. The extension automatically detects and renders the diagram
4. Enjoy viewing your diagrams without leaving your browser!

### Supported URL Patterns

- `*.drawio` - Standard draw.io files
- `*.drawio.xml` - XML format draw.io files
- `*.dio` - Alternative draw.io extension
- GitHub/GitLab raw file URLs containing draw.io content

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- pnpm 8+

### Setup

```bash
# Install dependencies
pnpm install

# Start development server with hot reload
pnpm dev

# Start development for Firefox
pnpm dev:firefox

# Build for production
pnpm build

# Create distribution zip
pnpm zip
```

### Project Structure

```
drawio-viewer/
├── entrypoints/
│   ├── content.ts          # Main content script
│   └── background.ts       # Background service worker
├── utils/
│   ├── xmlValidator.ts     # XML validation utilities
│   └── renderer.ts         # Diagram rendering logic
├── docs/                   # Technical documentation
├── wxt.config.ts          # WXT configuration
└── package.json
```

## 🔧 Technical Details

### Architecture

- **Framework**: [WXT](https://wxt.dev) - Modern web extension framework
- **Rendering Engine**: draw.io official viewer (viewer-static.min.js)
- **Manifest Version**: V3 (Chrome/Edge) and V2 (Firefox)
- **Build Tool**: Vite

### How It Works

1. Content script monitors page loads for draw.io file patterns
2. Extracts XML content from the page
3. Validates XML structure to ensure it's valid draw.io format
4. Injects draw.io viewer and renders the diagram locally
5. All processing happens client-side for maximum privacy

### Security & Privacy

- ✅ No external network requests
- ✅ All data processing happens locally
- ✅ No data collection or tracking
- ✅ Content Security Policy compliant
- ✅ Minimal permissions required

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [draw.io](https://github.com/jgraph/drawio) for the excellent diagramming tool and viewer
- [WXT](https://wxt.dev) for the modern extension development framework
- All contributors who help improve this project

## 📮 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/drawio-viewer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/drawio-viewer/discussions)

## 🗺️ Roadmap

- [ ] Chrome Web Store publication
- [ ] Firefox Add-ons publication
- [ ] Support for compressed draw.io files
- [ ] Dark mode support
- [ ] Zoom and pan controls
- [ ] Export rendered diagrams as images
- [ ] Multi-page diagram support

---

**Note**: This is an independent project and is not officially affiliated with draw.io or JGraph Ltd.
