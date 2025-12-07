/**
 * Draw.io Viewer 渲染器
 * 负责 DOM 替换、viewer 加载和 XML 渲染
 */

/**
 * 渲染配置接口
 */
interface RenderOptions {
  xmlContent: string;
  container?: HTMLElement;
  onProgress?: (progress: number) => void;
  onError?: (error: Error) => void;
}

/**
 * 渲染器类
 */
export class DrawioRenderer {
  private viewerLoaded = false;
  private loadingOverlay: HTMLElement | null = null;

  /**
   * 渲染 draw.io XML 内容
   */
  async render(options: RenderOptions): Promise<void> {
    const { xmlContent, onProgress, onError } = options;

    try {
      // 显示加载状态
      this.showLoadingUI();
      onProgress?.(10);

      // 清空并替换页面 DOM
      this.replaceDOMStructure();
      onProgress?.(20);

      // 加载 viewer 脚本
      await this.loadViewerScript();
      onProgress?.(50);

      // 创建渲染容器
      const container = this.createRenderContainer();
      onProgress?.(60);

      // 渲染 XML 内容
      await this.renderXML(xmlContent, container);
      onProgress?.(90);

      // 隐藏加载状态
      this.hideLoadingUI();
      onProgress?.(100);

      console.log('✓ Draw.io diagram rendered successfully');
    } catch (error) {
      console.error('Failed to render draw.io diagram:', error);
      this.showError(error as Error);
      onError?.(error as Error);
      throw error;
    }
  }

  /**
   * 显示加载状态 UI
   */
  private showLoadingUI(): void {
    this.loadingOverlay = document.createElement('div');
    this.loadingOverlay.id = 'drawio-loading-overlay';
    this.loadingOverlay.innerHTML = `
      <div class="loading-content">
        <div class="spinner"></div>
        <div class="loading-text">Loading Draw.io Viewer...</div>
        <div class="progress-bar">
          <div class="progress-fill" id="drawio-progress-fill"></div>
        </div>
      </div>
    `;

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      #drawio-loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }

      .loading-content {
        text-align: center;
        padding: 40px;
      }

      .spinner {
        width: 50px;
        height: 50px;
        margin: 0 auto 20px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .loading-text {
        font-size: 16px;
        color: #333;
        margin-bottom: 20px;
      }

      .progress-bar {
        width: 300px;
        height: 4px;
        background: #f3f3f3;
        border-radius: 2px;
        overflow: hidden;
        margin: 0 auto;
      }

      .progress-fill {
        height: 100%;
        background: #3498db;
        width: 0%;
        transition: width 0.3s ease;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(this.loadingOverlay);
  }



  /**
   * 隐藏加载状态 UI
   */
  private hideLoadingUI(): void {
    if (this.loadingOverlay) {
      this.loadingOverlay.remove();
      this.loadingOverlay = null;
    }
  }

  /**
   * 替换页面 DOM 结构
   */
  private replaceDOMStructure(): void {
    // 保存原始的 title
    const originalTitle = document.title;

    // 清空 body 内容
    document.body.innerHTML = '';

    // 重置样式
    document.body.style.cssText = `
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #ffffff;
    `;

    // 恢复 title
    document.title = originalTitle;

    console.log('✓ DOM structure replaced');
  }
  /**
   * 加载 viewer 脚本
   * 通过 background script 注入到 MAIN world
   */
  private async loadViewerScript(): Promise<void> {
    if (this.viewerLoaded) {
      console.log('[Content] Viewer script already loaded, skipping');
      return;
    }

    try {
      const scriptUrl = browser.runtime.getURL('/viewer/viewer-static.min.js');
      console.log('[Content] Requesting script injection:', scriptUrl);

      // 发送消息给 background script 请求注入脚本
      const response = await browser.runtime.sendMessage({
        type: 'INJECT_VIEWER_SCRIPT',
        scriptUrl: scriptUrl
      });

      if (!response || !response.success) {
        throw new Error(response?.error || 'Failed to inject script');
      }

      this.viewerLoaded = true;
      console.log('[Content] ✓ Viewer script injection requested successfully');

      // 等待脚本在 MAIN world 中加载完成
      await this.waitForGraphViewer();
    } catch (error) {
      console.error('[Content] ✗ Failed to load viewer script:', error);
      throw new Error(`Failed to load viewer script: ${error}`);
    }
  }

  /**
   * 等待 GraphViewer 在 MAIN world 中可用
   * 使用 window.postMessage 进行跨世界通信
   */
  private async waitForGraphViewer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        reject(new Error('Timeout waiting for GraphViewer'));
      }, 10000); // 10秒超时

      const messageHandler = (event: MessageEvent) => {
        // 只接受来自同一窗口的消息
        if (event.source !== window) return;

        if (event.data.type === 'GRAPHVIEWER_READY') {
          clearTimeout(timeout);
          window.removeEventListener('message', messageHandler);
          console.log('[Content] ✓ GraphViewer is ready in MAIN world');
          resolve();
        }
      };

      window.addEventListener('message', messageHandler);

      // 向 MAIN world 发送检查请求
      window.postMessage({ type: 'CHECK_GRAPHVIEWER' }, '*');
    });
  }

  /**
   * 创建渲染容器
   */
  private createRenderContainer(): HTMLElement {
    const container = document.createElement('div');
    container.id = 'drawio-viewer-container';
    container.style.cssText = `
      width: 100vw;
      height: 100vh;
      overflow: auto;
      background: #ffffff;
    `;

    document.body.appendChild(container);
    console.log('✓ Render container created');

    return container;
  }

  /**
   * 渲染 XML 内容
   * 通过 window.postMessage 与 MAIN world 通信
   */
  private async renderXML(xmlContent: string, container: HTMLElement): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('[Content] Starting renderXML...');

      const timeout = setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        reject(new Error('Timeout waiting for diagram render'));
      }, 30000); // 30秒超时

      const messageHandler = (event: MessageEvent) => {
        // 只接受来自同一窗口的消息
        if (event.source !== window) return;

        if (event.data.type === 'RENDER_SUCCESS') {
          clearTimeout(timeout);
          window.removeEventListener('message', messageHandler);
          console.log('[Content] ✓ Diagram rendered successfully');
          resolve();
        } else if (event.data.type === 'RENDER_ERROR') {
          clearTimeout(timeout);
          window.removeEventListener('message', messageHandler);
          console.error('[Content] ✗ Render error:', event.data.error);
          reject(new Error(event.data.error || 'Failed to render diagram'));
        }
      };

      window.addEventListener('message', messageHandler);

      // 向 MAIN world 发送渲染请求
      console.log('[Content] Sending render request to MAIN world, XML length:', xmlContent.length);
      window.postMessage({
        type: 'RENDER_DRAWIO',
        xmlContent: xmlContent,
        containerId: container.id
      }, '*');
    });
  }

  /**
   * 显示错误信息
   */
  private showError(error: Error): void {
    this.hideLoadingUI();

    const errorContainer = document.createElement('div');
    errorContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 40px;
      background: #fff;
      border: 2px solid #e74c3c;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 500px;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    errorContainer.innerHTML = `
      <div style="color: #e74c3c; font-size: 48px; margin-bottom: 20px;">⚠️</div>
      <h2 style="color: #333; margin: 0 0 10px 0;">Failed to Render Diagram</h2>
      <p style="color: #666; margin: 0 0 20px 0;">${error.message}</p>
      <button onclick="location.reload()" style="
        padding: 10px 20px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      ">Reload Page</button>
    `;

    document.body.appendChild(errorContainer);
  }
}

/**
 * 创建并返回渲染器实例
 */
export function createRenderer(): DrawioRenderer {
  return new DrawioRenderer();
}
