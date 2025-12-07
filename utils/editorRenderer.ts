/**
 * Draw.io 编辑器渲染器
 * 负责加载本地 draw.io 编辑器并处理通信
 */

import { DrawioMessage, DrawioAction } from './types';

export class DrawioEditorRenderer {
  private iframe: HTMLIFrameElement | null = null;
  private currentXML: string = '';
  private messageHandler: ((event: MessageEvent) => void) | null = null;
  private initPromiseResolve: (() => void) | null = null;

  /**
   * 渲染编辑器
   */
  async renderEditor(xmlContent: string): Promise<void> {
    console.log('🎨 Rendering Draw.io editor...');
    
    // 保存 XML 以便在 init 事件后加载
    this.currentXML = xmlContent;

    // 1. 设置消息监听（必须在创建 iframe 之前）
    this.setupMessageHandler();

    // 2. 创建 iframe 加载本地编辑器
    this.createEditorIframe();

    // 3. 等待编辑器初始化（init 事件会触发 XML 加载）
    await this.waitForEditorReady();
    
    console.log('✅ Draw.io editor rendered successfully');
  }

  /**
   * 创建编辑器 iframe（加载本地编辑器）
   */
  private createEditorIframe(): void {
    const iframe = document.createElement('iframe');
    iframe.id = 'drawio-editor-iframe';
    
    // 加载本地编辑器（embed=1 启用嵌入模式，lang=zh 设置中文）
    const editorUrl = browser.runtime.getURL('drawio-editor/index.html' as any);
    iframe.src = `${editorUrl}?embed=1&proto=json&spin=1&lang=zh`;
    iframe.style.cssText = `
      width: 100%;
      height: 100vh;
      border: none;
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9998;
    `;
    
    document.body.appendChild(iframe);
    this.iframe = iframe;
    
    console.log('📦 Editor iframe created');
  }

  /**
   * 设置消息处理器
   */
  private setupMessageHandler(): void {
    this.messageHandler = (event: MessageEvent) => {
      // 只接受来自本地 iframe 的消息
      if (event.source !== this.iframe?.contentWindow) {
        return;
      }

      try {
        const msg = typeof event.data === 'string'
          ? JSON.parse(event.data)
          : event.data;

        console.log('📨 Received message from editor:', msg);

        const eventType = msg.event as string;

        if (eventType === 'init' || eventType === 'ready' || eventType === 'configure') {
          // 编辑器初始化完成（可能是 init、ready 或 configure 事件）
          console.log(`✅ Editor initialized (${eventType} event), loading XML...`);
          // 编辑器初始化完成，立即加载 XML
          if (this.currentXML && this.iframe?.contentWindow) {
            const action: DrawioAction = {
              action: 'load',
              xml: this.currentXML,
              autosave: 0
            };
            this.iframe.contentWindow.postMessage(JSON.stringify(action), '*');
            console.log('📥 XML load command sent');
          }
          if (this.initPromiseResolve) {
            this.initPromiseResolve();
            this.initPromiseResolve = null;
          }
        } else if (eventType === 'save') {
          // 用户点击保存时，更新当前 XML
          if (msg.xml) {
            this.currentXML = msg.xml;
            console.log('💾 XML saved');
          }
        } else if (eventType === 'export') {
          // 导出完成
          if (msg.data) {
            this.currentXML = msg.data;
            console.log('📤 XML exported');
          }
        } else if (eventType === 'exit') {
          console.log('🚪 Editor exit requested');
        }
      } catch (error) {
        console.error('❌ Failed to parse message:', error, event.data);
      }
    };

    window.addEventListener('message', this.messageHandler);
    console.log('👂 Message handler setup complete');
  }

  /**
   * 等待编辑器就绪
   */
  private async waitForEditorReady(): Promise<void> {
    console.log('⏳ Waiting for editor to initialize...');
    
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Editor initialization timeout'));
      }, 15000);  // 15秒超时

      this.initPromiseResolve = () => {
        clearTimeout(timeout);
        resolve();
      };
    });
  }



  /**
   * 导出当前 XML（用于复制功能）
   */
  async exportXML(): Promise<string> {
    console.log('📤 Exporting XML from editor...');
    
    return new Promise((resolve, reject) => {
      if (!this.iframe?.contentWindow) {
        reject(new Error('Editor not initialized'));
        return;
      }

      const exportHandler = (event: MessageEvent) => {
        if (event.source !== this.iframe?.contentWindow) return;
        
        try {
          const msg: DrawioMessage = typeof event.data === 'string'
            ? JSON.parse(event.data)
            : event.data;
          
          if (msg.event === 'export') {
            window.removeEventListener('message', exportHandler);

            // xmlpng 格式返回的消息结构：
            // - msg.xml: 纯 XML 字符串
            // - msg.data: base64 编码的 PNG 图片
            // 我们只需要 XML 部分
            let xmlData = msg.xml || '';

            // 如果 xml 字段为空，尝试从 data 中提取（降级方案）
            if (!xmlData && msg.data) {
              const xmlMatch = msg.data.match(/<mxfile[^>]*>[\s\S]*<\/mxfile>/);
              if (xmlMatch) {
                xmlData = xmlMatch[0];
              }
            }

            if (!xmlData) {
              console.error('❌ No XML data found in export response');
              reject(new Error('No XML data in export response'));
              return;
            }

            this.currentXML = xmlData;
            console.log('✅ XML exported successfully, length:', xmlData.length);
            console.log('📄 XML preview:', xmlData.substring(0, 200) + '...');
            resolve(xmlData);
          }
        } catch (error) {
          console.error('❌ Export handler error:', error);
        }
      };

      window.addEventListener('message', exportHandler);

      // 请求导出纯 XML（不包含图片数据）
      const action: DrawioAction = {
        action: 'export',
        format: 'xmlpng'  // 使用 xmlpng 格式，但只取 XML 部分
      };
      
      this.iframe.contentWindow.postMessage(JSON.stringify(action), '*');

      // 设置超时
      setTimeout(() => {
        window.removeEventListener('message', exportHandler);
        reject(new Error('Export timeout'));
      }, 10000);
    });
  }

  /**
   * 获取当前 XML（如果已保存）
   */
  getCurrentXML(): string {
    return this.currentXML;
  }

  /**
   * 清理资源
   */
  destroy(): void {
    console.log('🧹 Cleaning up editor renderer...');
    
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
      this.messageHandler = null;
    }
    
    if (this.iframe) {
      this.iframe.remove();
      this.iframe = null;
    }
    
    this.currentXML = '';
    this.initPromiseResolve = null;
    
    console.log('✅ Editor renderer cleaned up');
  }
}
