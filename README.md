# Draw.io Editor Browser Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WXT](https://img.shields.io/badge/Built%20with-WXT-blue)](https://wxt.dev)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/yushukk/drawio-viewer/releases)

一个注重隐私的浏览器扩展，可在浏览器中本地编辑 draw.io 图表文件，无需将数据发送到外部服务器。

## ✨ 核心功能

- 🎨 **完整编辑器**: 集成完整的 draw.io 编辑器，支持所有编辑功能
- 📋 **一键复制 XML**: 编辑后可直接复制 XML 到剪贴板
- 🔒 **隐私优先**: 所有处理都在本地进行 - 不向外部服务器发送任何数据
- 🚀 **快速轻量**: 使用 draw.io 官方编辑器，响应迅速
- 🌐 **跨浏览器**: 支持 Chrome、Edge 和其他基于 Chromium 的浏览器
- 📁 **多格式支持**: 支持 `.drawio`、`.drawio.xml` 和 `.dio` 文件
- 🎯 **智能检测**: 自动检测 GitHub、GitLab 等平台上的 draw.io 文件
- 💻 **完全离线**: 安装后可完全离线使用
- 🌍 **中文界面**: 编辑器默认使用中文界面

## 🎯 使用场景

- 直接在 GitHub/GitLab 上编辑 draw.io 图表，无需下载
- 编辑后一键复制 XML 内容
- 在浏览器中快速编辑图表，无需打开完整的 draw.io 应用
- 完全本地处理，保护数据隐私

## 📦 安装方法

### 方法一：下载安装包（推荐）

1. **下载扩展包**
   - 从 [Releases 页面](https://github.com/yushukk/drawio-viewer/releases) 下载最新的 `drawio-viewer-1.0.0-chrome.zip`
   - 或者从项目根目录的 `.output/drawio-viewer-1.0.0-chrome.zip` 获取（如果你已经构建过）

2. **解压文件**
   ```bash
   unzip drawio-viewer-1.0.0-chrome.zip -d drawio-editor-extension
   ```

3. **安装到浏览器**
   
   **Chrome/Edge/Brave 等 Chromium 浏览器：**
   1. 打开浏览器扩展页面：
      - Chrome: 访问 `chrome://extensions/`
      - Edge: 访问 `edge://extensions/`
      - Brave: 访问 `brave://extensions/`
   2. 开启右上角的「开发者模式」
   3. 点击「加载已解压的扩展程序」
   4. 选择刚才解压的 `drawio-editor-extension` 文件夹
   5. 完成！扩展已安装

### 方法二：从源码构建

如果你想自己构建扩展：

1. **克隆仓库**
   ```bash
   git clone https://github.com/yushukk/drawio-viewer.git
   cd drawio-viewer
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **构建扩展**
   ```bash
   # 构建 Chrome/Edge 版本
   pnpm build
   
   # 生成安装包（可选）
   pnpm zip
   ```

4. **加载扩展**
   - 按照「方法一」的第 3 步，选择 `.output/chrome-mv3` 目录

## 🚀 使用方法

1. **安装扩展**（参考上面的安装方法）

2. **访问 draw.io 文件**
   - 在浏览器中打开任何 `.drawio` 文件的 URL
   - 例如：GitHub 上的 raw 文件链接

3. **自动打开编辑器**
   - 扩展会自动检测并在编辑器中打开图表
   - 可以直接编辑、修改图表

4. **复制编辑后的 XML**
   - 编辑完成后，点击右上角的「📋 复制 XML」按钮
   - XML 内容会自动复制到剪贴板
   - 可以粘贴到任何需要的地方

### 支持的文件格式

- `*.drawio` - 标准 draw.io 文件
- `*.drawio.xml` - XML 格式的 draw.io 文件
- `*.dio` - draw.io 的另一种扩展名
- GitHub/GitLab 等平台上包含 draw.io 内容的 raw 文件 URL

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
