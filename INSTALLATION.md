# Draw.io Editor Browser Extension - Installation Guide

English | [简体中文](INSTALLATION.zh-CN.md)

## 📦 Quick Installation (Recommended)

### Step 1: Get Installation Package

Two ways to get the extension package:

**Option A: Download from GitHub Releases**
- Visit [Releases page](https://github.com/yushukk/drawio-viewer/releases)
- Download the latest `drawio-viewer-1.0.0-chrome.zip`

**Option B: Build from Project**
```bash
# Clone project
git clone https://github.com/yushukk/drawio-viewer.git
cd drawio-viewer

# Install dependencies
pnpm install

# Build and package
pnpm build
pnpm zip

# Package location: .output/drawio-viewer-1.0.0-chrome.zip
```

### Step 2: Extract Package

```bash
# Extract to specified directory
unzip drawio-viewer-1.0.0-chrome.zip -d drawio-editor-extension
```

### Step 3: Install to Browser

#### Chrome Browser

1. Open Chrome browser
2. Enter in address bar: `chrome://extensions/`
3. Enable "Developer mode" toggle in top right corner
4. Click "Load unpacked" button
5. Select the extracted `drawio-editor-extension` folder
6. Done! Extension successfully installed

#### Microsoft Edge Browser

1. Open Edge browser
2. Enter in address bar: `edge://extensions/`
3. Enable "Developer mode" toggle in bottom left
4. Click "Load unpacked" button
5. Select the extracted `drawio-editor-extension` folder
6. Done! Extension successfully installed

#### Brave Browser

1. Open Brave browser
2. Enter in address bar: `brave://extensions/`
3. Enable "Developer mode" toggle in top right corner
4. Click "Load unpacked" button
5. Select the extracted `drawio-editor-extension` folder
6. Done! Extension successfully installed

---

## 🎯 Usage

### 1. Access draw.io Files

Open any `.drawio` file URL in your browser, for example:
- Raw files on GitHub: `https://raw.githubusercontent.com/user/repo/main/diagram.drawio`
- Raw files on GitLab
- Any webpage containing draw.io XML content

### 2. Auto-Open Editor

Extension automatically detects draw.io files and opens them in the editor:
- Full draw.io editing capabilities
- Chinese interface
- All editing happens locally

### 3. Copy Edited XML

After editing:
1. Click the "📋 Copy XML" button in top right corner
2. XML content automatically copied to clipboard
3. Paste wherever needed (e.g., GitHub, GitLab, etc.)

---

## 🔧 Troubleshooting

### Extension Won't Load

**Problem**: Error message after clicking "Load unpacked"

**Solutions**:
1. Ensure zip file is fully extracted
2. Ensure selected folder contains `manifest.json`
3. Check folder permissions to ensure browser can read

### Extension Loaded But Not Working

**Problem**: Extension doesn't respond when accessing draw.io files

**Solutions**:
1. Refresh the page (F5 or Cmd+R)
2. Check browser console for error messages (F12)
3. Ensure URL matches supported file formats (`.drawio`, `.drawio.xml`, `.dio`)

### Copy XML Feature Not Working

**Problem**: No response when clicking "Copy XML" button

**Solutions**:
1. Ensure browser allows clipboard access permissions
2. Try manually granting clipboard permissions
3. Check for conflicts with other extensions

---

## 📊 Extension Information

- **Version**: 1.0.0
- **Size**: Approximately 44 MB (includes full draw.io editor)
- **Supported Browsers**: Chrome, Edge, Brave, and other Chromium-based browsers
- **Required Permissions**:
  - Access to all websites (for detecting draw.io files)
  - Clipboard write (for copy XML functionality)

---

## 🔒 Privacy Statement

- ✅ **Fully Local Processing**: All editing and processing happens locally in browser
- ✅ **No Data Upload**: No data sent to any external servers
- ✅ **No Tracking**: No collection of user data or usage statistics
- ✅ **Offline Available**: Works completely offline after installation

---

## 📞 Get Help

If you encounter issues:

1. **View Documentation**: [README.md](README.md)
2. **Submit Issue**: [GitHub Issues](https://github.com/yushukk/drawio-viewer/issues)
3. **Join Discussion**: [GitHub Discussions](https://github.com/yushukk/drawio-viewer/discussions)

---

## 🎉 Get Started

After installation, visit any draw.io file URL and enjoy the convenience of local editing!
