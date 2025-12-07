# Draw.io Editor Browser Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WXT](https://img.shields.io/badge/Built%20with-WXT-blue)](https://wxt.dev)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/yushukk/drawio-viewer/releases)

English | [简体中文](README.zh-CN.md)

A privacy-focused browser extension that allows you to edit draw.io diagram files locally in your browser without sending data to external servers.

## ✨ Key Features

- 🎨 **Full Editor**: Integrated complete draw.io editor with all editing capabilities
- 📋 **One-Click XML Copy**: Copy edited XML directly to clipboard
- 🔒 **Privacy First**: All processing happens locally - no data sent to external servers
- 🚀 **Fast & Lightweight**: Uses official draw.io editor with quick response
- 🌐 **Cross-Browser**: Supports Chrome, Edge, and other Chromium-based browsers
- 📁 **Multiple Formats**: Supports `.drawio`, `.drawio.xml`, and `.dio` files
- 🎯 **Smart Detection**: Automatically detects draw.io files on GitHub, GitLab, and other platforms
- 💻 **Fully Offline**: Works completely offline after installation
- 🌍 **Chinese Interface**: Editor defaults to Chinese interface

## 🎯 Use Cases

- Edit draw.io diagrams directly on GitHub/GitLab without downloading
- One-click copy of XML content after editing
- Quick diagram editing in browser without opening full draw.io application
- Complete local processing to protect data privacy

## 📦 Installation

### Method 1: Download Package (Recommended)

1. **Download Extension Package**
   - Download the latest `drawio-viewer-1.0.0-chrome.zip` from [Releases page](https://github.com/yushukk/drawio-viewer/releases)
   - Or get it from `.output/drawio-viewer-1.0.0-chrome.zip` in project root (if you've already built it)

2. **Extract Files**
   ```bash
   unzip drawio-viewer-1.0.0-chrome.zip -d drawio-editor-extension
   ```

3. **Install to Browser**
   
   **Chrome/Edge/Brave and other Chromium browsers:**
   1. Open browser extensions page:
      - Chrome: Navigate to `chrome://extensions/`
      - Edge: Navigate to `edge://extensions/`
      - Brave: Navigate to `brave://extensions/`
   2. Enable "Developer mode" in the top right corner
   3. Click "Load unpacked"
   4. Select the extracted `drawio-editor-extension` folder
   5. Done! Extension is installed

For detailed installation instructions, see [Installation Guide](INSTALLATION.md).

### Method 2: Build from Source

If you want to build the extension yourself:

1. **Clone Repository**
   ```bash
   git clone https://github.com/yushukk/drawio-viewer.git
   cd drawio-viewer
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Build Extension**
   ```bash
   # Build Chrome/Edge version
   pnpm build
   
   # Generate package (optional)
   pnpm zip
   ```

4. **Load Extension**
   - Follow step 3 from "Method 1", selecting the `.output/chrome-mv3` directory

## 🚀 Usage

1. **Install Extension** (see installation methods above)

2. **Access draw.io Files**
   - Open any `.drawio` file URL in your browser
   - For example: raw file links on GitHub

3. **Auto-Open Editor**
   - Extension automatically detects and opens diagrams in the editor
   - Edit and modify diagrams directly

4. **Copy Edited XML**
   - After editing, click the "📋 Copy XML" button in the top right
   - XML content is automatically copied to clipboard
   - Paste wherever needed

### Supported File Formats

- `*.drawio` - Standard draw.io files
- `*.drawio.xml` - XML format draw.io files
- `*.dio` - Alternative draw.io extension
- Raw file URLs containing draw.io content on GitHub/GitLab and other platforms

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

- **Issues**: [GitHub Issues](https://github.com/yushukk/drawio-viewer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yushukk/drawio-viewer/discussions)

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
