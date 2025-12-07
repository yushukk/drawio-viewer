import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: 'Draw.io Viewer',
    description: 'A browser extension to render draw.io files locally',
    version: '1.0.0',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['<all_urls>'],
    web_accessible_resources: [
      {
        resources: ['viewer/*', 'drawio-editor/*'],
        matches: ['<all_urls>'],
      },
    ],
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; frame-src 'self'",
    },
  },
});
