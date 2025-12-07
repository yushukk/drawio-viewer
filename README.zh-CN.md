# Draw.io Editor 浏览器扩展

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WXT](https://img.shields.io/badge/Built%20with-WXT-blue)](https://wxt.dev)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/yushukk/drawio-viewer/releases)

[English](README.md) | 简体中文

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

详细安装说明请参考 [安装指南](INSTALLATION.zh-CN.md)。

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

## 🛠️ 开发

### 前置要求

- Node.js 18+ 
- pnpm 8+

### 设置

```bash
# 安装依赖
pnpm install

# 启动开发服务器（支持热重载）
pnpm dev

# 启动 Firefox 开发
pnpm dev:firefox

# 生产构建
pnpm build

# 创建分发包
pnpm zip
```

### 项目结构

```
drawio-viewer/
├── entrypoints/
│   ├── content.ts          # 主内容脚本
│   └── background.ts       # 后台服务工作进程
├── utils/
│   ├── xmlValidator.ts     # XML 验证工具
│   └── renderer.ts         # 图表渲染逻辑
├── docs/                   # 技术文档
├── wxt.config.ts          # WXT 配置
└── package.json
```

## 🔧 技术细节

### 架构

- **框架**: [WXT](https://wxt.dev) - 现代 Web 扩展框架
- **渲染引擎**: draw.io 官方查看器 (viewer-static.min.js)
- **Manifest 版本**: V3 (Chrome/Edge) 和 V2 (Firefox)
- **构建工具**: Vite

### 工作原理

1. 内容脚本监控页面加载，检测 draw.io 文件模式
2. 从页面提取 XML 内容
3. 验证 XML 结构以确保是有效的 draw.io 格式
4. 注入 draw.io 查看器并在本地渲染图表
5. 所有处理都在客户端进行，最大程度保护隐私

### 安全与隐私

- ✅ 无外部网络请求
- ✅ 所有数据处理都在本地进行
- ✅ 不收集或跟踪数据
- ✅ 符合内容安全策略
- ✅ 所需权限最少

## 🤝 贡献

欢迎贡献！请阅读我们的[贡献指南](CONTRIBUTING.md)了解行为准则和提交拉取请求的流程。

### 开发工作流

1. Fork 仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个拉取请求

## 📝 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [draw.io](https://github.com/jgraph/drawio) 提供优秀的图表工具和查看器
- [WXT](https://wxt.dev) 提供现代扩展开发框架
- 所有帮助改进此项目的贡献者

## 📮 联系与支持

- **问题反馈**: [GitHub Issues](https://github.com/yushukk/drawio-viewer/issues)
- **讨论**: [GitHub Discussions](https://github.com/yushukk/drawio-viewer/discussions)

## 🗺️ 路线图

- [ ] 发布到 Chrome Web Store
- [ ] 发布到 Firefox Add-ons
- [ ] 支持压缩的 draw.io 文件
- [ ] 深色模式支持
- [ ] 缩放和平移控制
- [ ] 导出渲染图表为图片
- [ ] 多页图表支持

---

**注意**: 这是一个独立项目，与 draw.io 或 JGraph Ltd. 没有官方关联。
