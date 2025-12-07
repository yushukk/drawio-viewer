/**
 * 编辑器工具栏组件
 * 提供复制 XML、切换模式等功能
 */

import { ToolbarOptions, NotificationType } from './types';

export class EditorToolbar {
  private toolbar: HTMLElement | null = null;
  private onCopyXML?: () => Promise<string>;

  /**
   * 创建浮动工具栏（替代顶部固定栏）
   */
  create(options: ToolbarOptions): void {
    this.onCopyXML = options.onCopyXML;

    const toolbar = document.createElement('div');
    toolbar.id = 'drawio-editor-toolbar';
    toolbar.style.cssText = `
      position: fixed;
      top: 1px;
      right: 5px;
      background: transparent;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    `;

    toolbar.innerHTML = `
      <button id="copy-xml-btn" style="
        padding: 3px 12px;
        background: rgba(52, 152, 219, 0.9);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 500;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 6px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(10px);
      ">
        <span style="font-size: 14px;">📋</span>
        <span>复制 XML</span>
      </button>
    `;

    document.body.appendChild(toolbar);
    this.toolbar = toolbar;

    // 复制 XML 按钮
    const copyBtn = toolbar.querySelector('#copy-xml-btn') as HTMLButtonElement;
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.handleCopyXML());
      copyBtn.addEventListener('mouseenter', () => {
        copyBtn.style.background = 'rgba(41, 128, 185, 0.95)';
        copyBtn.style.transform = 'translateY(-1px)';
        copyBtn.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.3)';
      });
      copyBtn.addEventListener('mouseleave', () => {
        copyBtn.style.background = 'rgba(52, 152, 219, 0.9)';
        copyBtn.style.transform = 'translateY(0)';
        copyBtn.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
      });
    }

    console.log('🎨 Floating toolbar created');
  }

  /**
   * 处理复制 XML（核心功能）
   */
  private async handleCopyXML(): Promise<void> {
    if (!this.onCopyXML) return;

    const copyBtn = document.querySelector('#copy-xml-btn') as HTMLButtonElement;
    if (!copyBtn) return;

    const originalText = copyBtn.textContent;

    try {
      copyBtn.textContent = '⏳ 导出中...';
      copyBtn.disabled = true;

      console.log('📤 Starting XML export...');

      // 1. 从编辑器导出当前 XML
      const xml = await this.onCopyXML();

      // 2. 复制到剪贴板
      await this.copyToClipboard(xml);

      // 3. 显示成功提示
      copyBtn.textContent = '✅ 已复制!';
      copyBtn.style.background = '#27ae60';

      this.showNotification('编辑后的 XML 已成功复制到剪贴板！', 'success');

      console.log('✅ XML copied successfully');

      // 2秒后恢复
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '#3498db';
        copyBtn.disabled = false;
      }, 2000);

    } catch (error) {
      console.error('❌ Failed to copy XML:', error);
      copyBtn.textContent = '❌ 复制失败';
      copyBtn.style.background = '#e74c3c';

      this.showNotification('复制失败，请重试', 'error');

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '#3498db';
        copyBtn.disabled = false;
      }, 2000);
    }
  }

  /**
   * 复制到剪贴板（包含降级方案）
   */
  private async copyToClipboard(text: string): Promise<void> {
    try {
      // 优先使用现代 Clipboard API
      await navigator.clipboard.writeText(text);
      console.log('✅ Copied using Clipboard API');
    } catch (error) {
      console.warn('⚠️ Clipboard API failed, using fallback method');
      // 降级到传统方法
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.top = '0';
      textarea.style.left = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (!successful) {
          throw new Error('execCommand failed');
        }
        console.log('✅ Copied using execCommand');
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }



  /**
   * 显示通知
   */
  private showNotification(message: string, type: NotificationType): void {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10001;
      font-size: 14px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        notification.remove();
        style.remove();
      }, 300);
    }, 3000);
  }

  /**
   * 销毁工具栏
   */
  destroy(): void {
    console.log('🧹 Cleaning up toolbar...');
    
    if (this.toolbar) {
      this.toolbar.remove();
      this.toolbar = null;
    }
    
    this.onCopyXML = undefined;

    console.log('✅ Toolbar cleaned up');
  }
}
