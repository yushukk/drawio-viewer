# Draw.io Editor 浏览器扩展 - 安装指南

## 📦 快速安装（推荐）

### 步骤 1：获取安装包

有两种方式获取扩展安装包：

**方式 A：从 GitHub Releases 下载**
- 访问 [Releases 页面](https://github.com/yushukk/drawio-viewer/releases)
- 下载最新版本的 `drawio-viewer-1.0.0-chrome.zip`

**方式 B：从项目构建**
```bash
# 克隆项目
git clone https://github.com/yushukk/drawio-viewer.git
cd drawio-viewer

# 安装依赖
pnpm install

# 构建并打包
pnpm build
pnpm zip

# 安装包位置：.output/drawio-viewer-1.0.0-chrome.zip
```

### 步骤 2：解压安装包

```bash
# 解压到指定目录
unzip drawio-viewer-1.0.0-chrome.zip -d drawio-editor-extension
```

### 步骤 3：安装到浏览器

#### Chrome 浏览器

1. 打开 Chrome 浏览器
2. 在地址栏输入：`chrome://extensions/`
3. 开启右上角的「开发者模式」开关
4. 点击「加载已解压的扩展程序」按钮
5. 选择刚才解压的 `drawio-editor-extension` 文件夹
6. 完成！扩展已成功安装

#### Microsoft Edge 浏览器

1. 打开 Edge 浏览器
2. 在地址栏输入：`edge://extensions/`
3. 开启左下角的「开发人员模式」开关
4. 点击「加载解压缩的扩展」按钮
5. 选择刚才解压的 `drawio-editor-extension` 文件夹
6. 完成！扩展已成功安装

#### Brave 浏览器

1. 打开 Brave 浏览器
2. 在地址栏输入：`brave://extensions/`
3. 开启右上角的「开发者模式」开关
4. 点击「加载解压缩的扩展程序」按钮
5. 选择刚才解压的 `drawio-editor-extension` 文件夹
6. 完成！扩展已成功安装

---

## 🎯 使用方法

### 1. 访问 draw.io 文件

在浏览器中打开任何 `.drawio` 文件的 URL，例如：
- GitHub 上的 raw 文件：`https://raw.githubusercontent.com/user/repo/main/diagram.drawio`
- GitLab 上的 raw 文件
- 任何包含 draw.io XML 内容的网页

### 2. 自动打开编辑器

扩展会自动检测 draw.io 文件并在编辑器中打开：
- 完整的 draw.io 编辑功能
- 中文界面
- 所有编辑都在本地进行

### 3. 复制编辑后的 XML

编辑完成后：
1. 点击右上角的「📋 复制 XML」按钮
2. XML 内容自动复制到剪贴板
3. 可以粘贴到任何需要的地方（如 GitHub、GitLab 等）

---

## 🔧 故障排除

### 扩展无法加载

**问题**：点击「加载已解压的扩展程序」后提示错误

**解决方案**：
1. 确保已完全解压 zip 文件
2. 确保选择的是包含 `manifest.json` 的文件夹
3. 检查文件夹权限，确保浏览器可以读取

### 扩展已加载但不工作

**问题**：访问 draw.io 文件时扩展没有反应

**解决方案**：
1. 刷新页面（F5 或 Cmd+R）
2. 检查浏览器控制台是否有错误信息（F12）
3. 确保 URL 匹配支持的文件格式（`.drawio`、`.drawio.xml`、`.dio`）

### 复制 XML 功能不工作

**问题**：点击「复制 XML」按钮没有反应

**解决方案**：
1. 确保浏览器允许剪贴板访问权限
2. 尝试手动授予剪贴板权限
3. 检查是否有其他扩展冲突

---

## 📊 扩展信息

- **版本**：1.0.0
- **大小**：约 44 MB（包含完整的 draw.io 编辑器）
- **支持浏览器**：Chrome、Edge、Brave 等 Chromium 内核浏览器
- **权限要求**：
  - 访问所有网站（用于检测 draw.io 文件）
  - 剪贴板写入（用于复制 XML 功能）

---

## 🔒 隐私说明

- ✅ **完全本地处理**：所有编辑和处理都在浏览器本地进行
- ✅ **无数据上传**：不向任何外部服务器发送数据
- ✅ **无追踪**：不收集任何用户数据或使用统计
- ✅ **离线可用**：安装后可完全离线使用

---

## 📞 获取帮助

如果遇到问题：

1. **查看文档**：[README.md](README.md)
2. **提交 Issue**：[GitHub Issues](https://github.com/yushukk/drawio-viewer/issues)
3. **参与讨论**：[GitHub Discussions](https://github.com/yushukk/drawio-viewer/discussions)

---

## 🎉 开始使用

安装完成后，访问任何 draw.io 文件 URL，享受本地编辑的便利！
