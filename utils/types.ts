/**
 * 类型定义文件
 * 定义编辑器模式、消息类型等
 */

/**
 * 渲染模式
 */
export enum RenderMode {
  VIEWER = 'viewer',  // 预览模式
  EDITOR = 'editor'   // 编辑模式
}

/**
 * Draw.io 消息事件类型
 */
export interface DrawioMessage {
  event: 'init' | 'ready' | 'load' | 'save' | 'export' | 'exit' | 'configure';
  xml?: string;
  data?: string;
  format?: string;
  message?: string;
}

/**
 * Draw.io 动作类型
 */
export interface DrawioAction {
  action: 'load' | 'export' | 'configure';
  xml?: string;
  format?: string;
  autosave?: number;
}

/**
 * 编辑器渲染选项
 */
export interface EditorRenderOptions {
  xmlContent: string;
  mode: RenderMode;
}

/**
 * 工具栏选项
 */
export interface ToolbarOptions {
  onCopyXML: () => Promise<string>;
  onSwitchMode?: () => void;
}

/**
 * 通知类型
 */
export type NotificationType = 'success' | 'error' | 'info';
