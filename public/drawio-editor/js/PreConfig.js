/**
 * Copyright (c) 2006-2024, JGraph Holdings Ltd
 * Copyright (c) 2006-2024, draw.io AG
 *
 * Modified for Aone Copilot Draw.io Viewer Extension
 * Configuration for complete offline mode
 */

// Overrides of global vars need to be pre-loaded
window.DRAWIO_PUBLIC_BUILD = true;
window.EXPORT_URL = null;  // 禁用图片服务器
window.PLANT_URL = null;   // 禁用 PlantUML 服务器
window.DRAWIO_BASE_URL = null;
window.DRAWIO_VIEWER_URL = null;
window.DRAWIO_LIGHTBOX_URL = null;
window.DRAW_MATH_URL = 'math4/es5';

// 完全离线配置
window.DRAWIO_CONFIG = {
  // 完全离线模式
  offline: true,
  local: true,

  // 禁用所有外部连接
  showRemoteIcon: false,
  templatesEnabled: false,

  // 禁用在线存储
  enabledLibraries: [],

  // UI 配置 - 最小化界面
  ui: 'min',

  // 禁用外部插件
  plugins: [],

  // 禁用所有云服务集成
  defaultLibraries: 'general',
  enabledLibraries: ['general'],

  // 禁用外部服务
  compressXml: false
};

// 禁用所有外部服务
urlParams['sync'] = 'manual';
urlParams['stealth'] = '1';
urlParams['offline'] = '1';
urlParams['https'] = '0';
urlParams['gapi'] = '0';
urlParams['db'] = '0';
urlParams['gh'] = '0';
urlParams['gl'] = '0';
urlParams['tr'] = '0';
urlParams['od'] = '0';

console.log('Draw.io PreConfig loaded - Complete offline mode enabled');
