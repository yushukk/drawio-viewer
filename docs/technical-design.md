# 浏览器扩展实现 draw.io 文件本地渲染技术方案

## 方案概述
开发一个浏览器扩展，能够在用户访问 `.drawio` 原始文件页面时，拦截页面内容并使用本地打包的 draw.io 渲染引擎进行图形化展示，无需发送数据到外部服务器。

## 核心技术选型

### 1. 扩展框架
- **选定选项**: WXT
- **理由**: 
  - WXT 是一个现代、开源的框架，简化了跨浏览器扩展的开发过程
  - 相比 Plasmo，WXT 更加灵活和可配置，不强制使用特定的前端框架
  - WXT 提供了优秀的开发者体验，包括热重载、自动打包和发布工具
  - WXT 使用 Vite 作为底层构建工具，具有更好的构建性能和生态系统支持
  - 社区反馈表明 WXT 在企业级项目中更加可靠和可定制

### 2. Draw.io 渲染引擎
- **方案**: 使用 draw.io 的离线 Viewer 模式
- **实现方式**:
  - 从 [draw.io GitHub 仓库](https://github.com/jgraph/drawio/tree/dev/src/main/webapp/js) 下载 `viewer-static.min.js` 文件
  - 将其作为静态资源打包进扩展中
  - 在 content script 中动态加载并初始化渲染器

### 3. 页面劫持与内容注入
- **触发机制**: 
  - 通过 content script 监听特定 URL 模式（如 `*.drawio` 或 GitHub raw 文件页面）
  - 检测 HTTP 响应体是否为 draw.io XML 格式
- **DOM 操作**:
  - 清空原页面内容 (`document.body.innerHTML = ''`)
  - 创建新的根容器 `<div id="drawio-viewer-container">`
  - 加载本地 draw.io viewer 并传入 XML 数据

## 架构设计

### 1. 扩展结构 (基于 WXT 框架)
```
/src
  ├── entrypoints/
  │   ├── content.ts             // 主要逻辑：检测页面、提取XML、渲染图表
  │   ├── background.ts          // 处理扩展生命周期事件
  │   └── popup.html             // （可选）配置界面
  ├── viewer/                
  │   └── viewer-static.min.js   // 官方提供的离线渲染器
  ├── components/                // 可复用的 UI 组件
  ├── utils/                     // 工具函数
  │   └── xmlValidator.ts        // 验证 draw.io XML 格式
  └── assets/                    // 静态资源
      └── icon.png               // 扩展图标
/wxt.config.ts                  // WXT 配置文件
manifest.json                   // 扩展配置文件（由 WXT 生成）
```

### 2. 关键流程
1. 用户访问 `.drawio` 原始文件页面
2. Content Script 被激活，通过 DOM API 读取页面文本内容
3. 使用工具函数验证内容是否为有效的 draw.io XML 格式（检查 `<mxGraphModel>` 标签）
4. 替换页面 DOM，注入 draw.io viewer
5. 初始化 viewer 并传入 XML 数据进行渲染

## 安全与合规性

### 1. Content Security Policy (CSP)
- 配置 manifest.json 中的 `content_security_policy` 字段
- 允许加载本地脚本 (`'self'`) 和内联哈希值
- 禁止所有外部网络请求以确保数据隐私
- 示例配置：
  ```json
  {
    "content_security_policy": {
      "extension_pages": "script-src 'self' 'unsafe-hashes'; object-src 'self'"
    }
  }
  ```

### 2. 数据处理原则
- 所有操作均在客户端完成，不上传任何数据
- XML 解析和渲染完全依赖本地资源
- 不使用 eval() 或其他不安全的 JavaScript 功能

## 实现难点与解决方案

### 1. CSP 限制
- **问题**: Manifest V3 对 CSP 有严格限制
- **解决**: 使用 `'unsafe-hashes'` 和 SHA-256 哈希允许特定内联脚本

### 2. DOM 注入冲突
- **问题**: 网站原有样式可能影响渲染效果
- **解决**: 使用 Shadow DOM 隔离样式或重置 CSS

### 3. 大文件性能
- **问题**: 大型 draw.io 文件可能导致页面卡顿
- **解决**: 异步加载 viewer 并显示加载状态
