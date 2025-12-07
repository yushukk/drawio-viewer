# Task 03: 获取并集成draw.io viewer资源及开发DOM替换和渲染功能

## 工作目标
从draw.io官方仓库获取viewer资源，并将其正确集成到项目中，同时实现页面DOM结构的替换，并集成draw.io viewer进行XML数据的图形化渲染。

## 具体工作内容
1. 从draw.io GitHub仓库下载viewer-static.min.js文件
2. 将viewer资源放置在项目的正确目录中
3. 验证viewer资源的完整性和可用性
4. 配置构建工具以正确处理viewer资源
5. 开发DOM操作功能，清空原页面内容
6. 创建新的根容器用于承载draw.io viewer
7. 实现draw.io viewer的动态加载机制
8. 开发XML数据注入和渲染功能
9. 处理渲染过程中的错误和异常情况
10. 实现样式隔离机制（Shadow DOM或CSS Reset）
11. 添加加载状态UI和进度提示
12. 实现大文件异步加载优化

## 完成标准
- [ ] viewer资源文件已下载并放置在/src/viewer/目录下
- [ ] 构建工具能正确处理和打包viewer资源
- [ ] 能够清空原页面DOM并创建新的根容器
- [ ] draw.io viewer能够动态加载并正确渲染XML数据
- [ ] 渲染过程中的错误能得到妥善处理
- [ ] 实现样式隔离，避免与原页面样式冲突
- [ ] 显示加载状态UI，提升用户体验
- [ ] 大文件（>1MB）能够流畅加载和渲染

## 验收方法
1. 检查viewer资源文件是否存在且能正确引用
2. 访问测试.drawio文件页面，确认页面被正确替换并渲染图形
3. 测试不同尺寸的.drawio文件，验证渲染效果
4. 验证样式隔离效果，确认不受原页面样式影响
5. 测试加载状态UI是否正常显示
6. 使用大文件（>1MB）测试性能和加载体验

---

## 实现细节

### 1. Viewer 资源集成
- **文件位置**: `public/viewer/viewer-static.min.js` (3.5MB)
- **来源**: draw.io 官方 GitHub 仓库
- **配置**: 通过 `wxt.config.ts` 中的 `web_accessible_resources` 配置，允许页面访问

### 2. Chrome MV3 World Isolation 解决方案

#### 问题背景
Chrome MV3 引入了 World Isolation 机制，Content Script 运行在 ISOLATED world，无法直接访问页面的 window 对象和全局变量（如 GraphViewer）。

#### 解决方案
使用 `browser.scripting.executeScript` API 的 `world: 'MAIN'` 参数将脚本注入到页面主世界：

```typescript
// background.ts
await browser.scripting.executeScript({
  target: { tabId },
  world: 'MAIN', // 注入到页面的主世界
  func: (scriptUrl: string) => {
    // 动态加载 viewer-static.min.js
    const script = document.createElement('script');
    script.src = scriptUrl;
    document.head.appendChild(script);
  },
  args: [scriptUrl]
});
```

### 3. 跨世界通信机制

使用 `window.postMessage` 实现 Content Script 和 MAIN world 之间的通信：

```typescript
// Content Script → MAIN World
window.postMessage({ 
  type: 'RENDER_DRAWIO',
  xmlContent: xmlData,
  containerId: 'drawio-container'
}, '*');

// MAIN World → Content Script
window.postMessage({ 
  type: 'RENDER_SUCCESS' 
}, '*');
```

### 4. GraphViewer 正确使用方式

**关键发现**: 不能直接调用 `new GraphViewer()`，而应该使用 `GraphViewer.processElements()` 方法。

正确的渲染流程：

```typescript
// 1. 创建配置对象
const mxGraphData = {
  highlight: '#0000ff',
  nav: true,
  resize: true,
  toolbar: 'zoom layers lightbox',
  edit: '_blank',
  xml: xmlContent  // draw.io XML 内容
};

// 2. 创建 mxgraph div
const mxGraphDiv = document.createElement('div');
mxGraphDiv.className = 'mxgraph';
mxGraphDiv.style.cssText = 'max-width:100%;border:1px solid transparent;';

// 3. 设置 data-mxgraph 属性（不需要手动转义）
const jsonString = JSON.stringify(mxGraphData);
mxGraphDiv.setAttribute('data-mxgraph', jsonString);

// 4. 添加到容器
container.appendChild(mxGraphDiv);

// 5. 调用 processElements 处理
GraphViewer.processElements();
```

**重要提示**:
- 使用 `setAttribute` 时不需要手动转义 JSON，浏览器会自动处理
- 必须使用 `GraphViewer.processElements()` 而非构造函数
- `data-mxgraph` 属性必须包含完整的 JSON 配置

### 5. 完整的通信流程

```
1. Content Script 检测到 draw.io 文件
2. Content Script → Background: 请求注入 viewer 脚本
3. Background → MAIN World: 使用 scripting API 注入脚本
4. MAIN World: 加载 viewer-static.min.js
5. MAIN World → Content Script: 发送 GRAPHVIEWER_READY 消息
6. Content Script → MAIN World: 发送 RENDER_DRAWIO 消息（包含 XML）
7. MAIN World: 使用 GraphViewer.processElements() 渲染
8. MAIN World → Content Script: 发送 RENDER_SUCCESS 消息
9. Content Script: 更新 UI 状态
```

### 6. 核心文件说明

- **`entrypoints/background.ts`**: 处理脚本注入和消息转发
- **`entrypoints/content.ts`**: 页面检测和流程控制
- **`utils/renderer.ts`**: 渲染逻辑和跨世界通信
- **`utils/xmlValidator.ts`**: XML 验证
- **`public/viewer/viewer-static.min.js`**: Draw.io viewer 库

### 7. 安全策略

项目已通过 WXT 框架自动配置了符合 Chrome MV3 标准的 Content Security Policy：

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';",
    "sandbox": "script-src 'self' 'unsafe-inline' 'unsafe-eval'; ..."
  },
  "web_accessible_resources": [{
    "resources": ["viewer/*"],
    "matches": ["<all_urls>"]
  }]
}
```

**安全特性**:
- ✅ 所有数据在本地处理，不发送到外部服务器
- ✅ viewer-static.min.js 从本地加载，不依赖 CDN
- ✅ 使用安全的脚本注入方式（scripting API）
- ✅ 权限最小化原则

### 8. 已知问题和解决方案

#### 问题 1: XMLSerializer 错误
**错误**: `Failed to execute 'serializeToString' on 'XMLSerializer': parameter 1 is not of type 'Node'`

**原因**: 直接调用 `new GraphViewer()` 构造函数传递 XML 字符串

**解决**: 改用 `GraphViewer.processElements()` 方法，通过 `data-mxgraph` 属性传递配置

#### 问题 2: JSON 解析错误
**错误**: `Expected property name or '}' in JSON at position 1`

**原因**: 手动转义 JSON 字符串导致双重转义

**解决**: 直接使用 `setAttribute`，浏览器会自动处理转义

### 9. 性能优化

- 使用 sessionStorage 缓存 XML 数据，避免重复解析
- 异步加载 viewer 脚本，不阻塞页面渲染
- 进度条提示，提升用户体验
- 延迟发送成功消息，确保渲染完成

### 10. 测试验证

✅ **功能测试**
- 成功渲染 draw.io 图表
- 支持缩放、导航等交互功能
- 工具栏正常工作

✅ **兼容性测试**
- Chrome MV3 扩展规范
- 各种 Git 平台（GitHub、GitLab、Gitee 等）
- 不同大小的 draw.io 文件

✅ **安全性测试**
- 无 CSP 违规错误
- 数据隐私保护
- 无外部网络请求