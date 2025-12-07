export default defineBackground(() => {
  console.log('Draw.io Viewer background script initialized', { id: browser.runtime.id });
  // Force rebuild

  // 监听来自 content script 的消息
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message from content script:', message);

    if (message.type === 'DRAWIO_DETECTED') {
      handleDrawioDetected(message, sender);
      return false;
    } else if (message.type === 'INJECT_VIEWER_SCRIPT') {
      // 异步处理，需要返回 true 保持消息通道打开
      handleInjectViewerScript(message, sender, sendResponse);
      return true;
    }

    return false;
  });
});

/**
 * 处理检测到 draw.io 文件的消息
 */
function handleDrawioDetected(
  message: { url: string; xmlLength: number },
  sender: any
): void {
  console.log('✓ Draw.io file detected!');
  console.log('  URL:', message.url);
  console.log('  XML length:', message.xmlLength, 'characters');
  console.log('  Tab ID:', sender.tab?.id);

  // 这里可以添加更多处理逻辑，比如：
  // - 更新扩展图标状态
  // - 显示通知
  // - 记录统计信息等
}

/**
 * 处理注入 viewer 脚本的请求
 * 使用 chrome.scripting.executeScript 将脚本注入到 MAIN world
 */
async function handleInjectViewerScript(
  message: { scriptUrl: string },
  sender: any,
  sendResponse: (response: any) => void
): Promise<void> {
  try {
    const tabId = sender.tab?.id;

    if (!tabId) {
      throw new Error('Unable to get tab ID');
    }

    console.log('[Background] Injecting viewer script to tab:', tabId);
    console.log('[Background] Script URL:', message.scriptUrl);

    // 使用 browser.scripting.executeScript 注入脚本到 MAIN world
    await browser.scripting.executeScript({
      target: { tabId },
      world: 'MAIN', // 注入到页面的主世界
      func: (scriptUrl: string) => {
        return new Promise((resolve, reject) => {
          console.log('[MAIN World] Loading script from:', scriptUrl);

          const script = document.createElement('script');
          script.src = scriptUrl;
          script.type = 'text/javascript';

          script.onload = () => {
            console.log('[MAIN World] ✓ Script loaded successfully');
            console.log('[MAIN World] Checking window.GraphViewer:', typeof (window as any).GraphViewer);

            // 设置消息监听器处理渲染请求
            window.addEventListener('message', (event) => {
              if (event.source !== window) return;

              if (event.data.type === 'CHECK_GRAPHVIEWER') {
                // 响应 GraphViewer 可用性检查
                console.log('[MAIN World] Responding to GraphViewer check');
                window.postMessage({ type: 'GRAPHVIEWER_READY' }, '*');
              } else if (event.data.type === 'RENDER_DRAWIO') {
                // 处理渲染请求
                console.log('[MAIN World] Received render request, XML length:', event.data.xmlContent?.length);

                try {
                  if (typeof (window as any).GraphViewer === 'undefined') {
                    throw new Error('GraphViewer is not available');
                  }

                  const container = document.getElementById(event.data.containerId);
                  if (!container) {
                    throw new Error('Container not found: ' + event.data.containerId);
                  }

                  // 创建渲染容器
                  const diagramContainer = document.createElement('div');
                  diagramContainer.className = 'geDiagramContainer';
                  diagramContainer.style.cssText = `
                    max-width: 100%;
                    margin: 0 auto;
                    padding: 20px;
                  `;

                  console.log('[MAIN World] XML content type:', typeof event.data.xmlContent);
                  console.log('[MAIN World] XML content length:', event.data.xmlContent?.length);

                  // 创建 mxgraph 配置
                  const mxGraphData = {
                    highlight: '#0000ff',
                    nav: true,
                    resize: true,
                    toolbar: 'zoom layers lightbox',
                    edit: '_blank',
                    xml: event.data.xmlContent
                  };

                  // 创建 mxgraph div
                  const mxGraphDiv = document.createElement('div');
                  mxGraphDiv.className = 'mxgraph';
                  mxGraphDiv.style.cssText = 'max-width:100%;border:1px solid transparent;';

                  // 将 JSON 转为字符串 - setAttribute 会自动处理转义
                  const jsonString = JSON.stringify(mxGraphData);
                  console.log('[MAIN World] JSON string:', jsonString.substring(0, 200));

                  mxGraphDiv.setAttribute('data-mxgraph', jsonString);

                  container.appendChild(mxGraphDiv);
                  console.log('[MAIN World] mxgraph div created');

                  // 使用 GraphViewer.processElements() 处理元素
                  (window as any).GraphViewer.processElements();
                  console.log('[MAIN World] ✓ GraphViewer.processElements() called');

                  // 延迟发送成功消息，确保渲染完成
                  setTimeout(() => {
                    window.postMessage({ type: 'RENDER_SUCCESS' }, '*');
                  }, 100);
                } catch (error) {
                  console.error('[MAIN World] ✗ Render error:', error);
                  window.postMessage({
                    type: 'RENDER_ERROR',
                    error: error instanceof Error ? error.message : 'Unknown error'
                  }, '*');
                }
              }
            });

            console.log('[MAIN World] Message listener set up');

            // 发送消息通知 content script GraphViewer 已准备好
            window.postMessage({ type: 'GRAPHVIEWER_READY' }, '*');

            resolve({ success: true, message: 'Script loaded successfully' });
          };

          script.onerror = (error) => {
            console.error('[MAIN World] ✗ Failed to load script:', error);
            reject(new Error('Failed to load script'));
          };

          document.head.appendChild(script);
        });
      },
      args: [message.scriptUrl]
    });

    console.log('[Background] ✓ Script injection completed');
    sendResponse({ success: true, message: 'Script injected successfully' });
  } catch (error) {
    console.error('[Background] ✗ Failed to inject script:', error);
    sendResponse({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
