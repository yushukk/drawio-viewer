/**
 * Draw.io 模式管理器
 * 统一管理 Viewer 和 Editor 两种模式
 */

import { RenderMode } from './types';
import { DrawioRenderer } from './renderer';
import { DrawioEditorRenderer } from './editorRenderer';
import { EditorToolbar } from './editorToolbar';

export class DrawioModeManager {
  private currentMode: RenderMode = RenderMode.VIEWER;
  private viewerRenderer: DrawioRenderer | null = null;
  private editorRenderer: DrawioEditorRenderer | null = null;
  private toolbar: EditorToolbar | null = null;
  private xmlContent: string = '';

  /**
   * 初始化并渲染
   */
  async initialize(xmlContent: string, initialMode: RenderMode = RenderMode.VIEWER): Promise<void> {
    console.log(`🚀 Initializing mode manager with mode: ${initialMode}`);
    this.xmlContent = xmlContent;
    await this.switchMode(initialMode);

    // 监听模式切换事件
    window.addEventListener('drawio-switch-mode', this.handleModeSwitch.bind(this));
    
    console.log('✅ Mode manager initialized');
  }

  /**
   * 处理模式切换事件
   */
  private handleModeSwitch(event: Event): void {
    const customEvent = event as CustomEvent;
    const mode = customEvent.detail?.mode;
    if (mode) {
      this.switchMode(mode);
    }
  }

  /**
   * 切换模式
   */
  async switchMode(mode: RenderMode): Promise<void> {
    // 如果是首次初始化（viewerRenderer 和 editorRenderer 都为 null），强制渲染
    const isFirstRender = !this.viewerRenderer && !this.editorRenderer;

    if (this.currentMode === mode && !isFirstRender) {
      console.log(`ℹ️ Already in ${mode} mode`);
      return;
    }

    console.log(`🔄 Switching ${isFirstRender ? 'to' : 'from ' + this.currentMode + ' to'} ${mode} mode...`);

    // 清理当前模式
    this.cleanup();

    this.currentMode = mode;

    if (mode === RenderMode.VIEWER) {
      await this.renderViewer();
    } else {
      await this.renderEditor();
    }

    console.log(`✅ Switched to ${mode} mode`);
  }

  /**
   * 渲染预览模式（已禁用，仅保留代码结构）
   */
  private async renderViewer(): Promise<void> {
    console.log('🎨 Rendering viewer mode...');

    this.viewerRenderer = new DrawioRenderer();
    await this.viewerRenderer.render({
      xmlContent: this.xmlContent
    });

    // 预览模式已隐藏，不添加切换按钮
    // this.addSwitchButton(RenderMode.EDITOR);
    
    console.log('✅ Viewer mode rendered');
  }

  /**
   * 渲染编辑模式
   */
  private async renderEditor(): Promise<void> {
    console.log('🎨 Rendering editor mode...');
    
    this.editorRenderer = new DrawioEditorRenderer();
    await this.editorRenderer.renderEditor(this.xmlContent);

    // 创建工具栏
    this.toolbar = new EditorToolbar();
    this.toolbar.create({
      onCopyXML: async () => {
        if (!this.editorRenderer) {
          throw new Error('Editor not initialized');
        }
        const xml = await this.editorRenderer.exportXML();
        this.xmlContent = xml;  // 更新当前 XML
        return xml;
      }
    });
    
    console.log('✅ Editor mode rendered');
  }



  /**
   * 清理当前模式
   */
  private cleanup(): void {
    console.log('🧹 Cleaning up current mode...');
    
    // 清理 viewer
    if (this.viewerRenderer) {
      // DrawioRenderer 没有 destroy 方法，直接清空 body
      document.body.innerHTML = '';
      this.viewerRenderer = null;
    }

    // 清理 editor
    if (this.editorRenderer) {
      this.editorRenderer.destroy();
      this.editorRenderer = null;
    }

    // 清理 toolbar
    if (this.toolbar) {
      this.toolbar.destroy();
      this.toolbar = null;
    }

    // 移除切换按钮
    const switchBtn = document.getElementById('mode-switch-btn');
    if (switchBtn) {
      switchBtn.remove();
    }
    
    console.log('✅ Cleanup complete');
  }

  /**
   * 获取当前模式
   */
  getCurrentMode(): RenderMode {
    return this.currentMode;
  }

  /**
   * 获取当前 XML
   */
  getCurrentXML(): string {
    return this.xmlContent;
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    console.log('🧹 Destroying mode manager...');
    
    this.cleanup();
    
    window.removeEventListener('drawio-switch-mode', this.handleModeSwitch.bind(this));
    
    this.xmlContent = '';
    this.currentMode = RenderMode.VIEWER;
    
    console.log('✅ Mode manager destroyed');
  }
}
