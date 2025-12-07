import { isDrawioXML, extractDrawioXML, validateXMLStructure } from '@/utils/xmlValidator';
import { createRenderer } from '@/utils/renderer';

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    console.log('Draw.io Viewer content script loaded');

    // 检查当前页面是否可能包含 draw.io 文件
    if (shouldProcessPage()) {
      processPage();
    }
  },
});

/**
 * 判断当前页面是否应该被处理
 * 检查 URL 模式和页面特征
 */
function shouldProcessPage(): boolean {
  const url = window.location.href;
  const pathname = window.location.pathname;

  // 检查 URL 是否匹配 draw.io 文件模式
  const urlPatterns = [
    /\.drawio$/i,           // .drawio 文件
    /\.drawio\.xml$/i,      // .drawio.xml 文件
    /\.dio$/i,              // .dio 文件（draw.io 的另一种扩展名）
  ];

  const matchesPattern = urlPatterns.some(pattern => pattern.test(pathname));

  if (matchesPattern) {
    console.log('URL matches draw.io file pattern:', url);
    return true;
  }

  // 检查是否是 GitHub/GitLab 等平台的 raw 文件页面
  const isRawFile = /\/(raw|blob)\//.test(pathname) && 
                    (pathname.endsWith('.drawio') || 
                     pathname.endsWith('.drawio.xml') ||
                     pathname.endsWith('.dio'));

  if (isRawFile) {
    console.log('Detected raw file page:', url);
    return true;
  }

  return false;
}

/**
 * 处理页面内容
 * 提取并验证 draw.io XML
 */
async function processPage(): Promise<void> {
  try {
    // 获取页面文本内容
    const pageContent = getPageContent();
    
    if (!pageContent) {
      console.warn('Failed to extract page content');
      return;
    }

    console.log('Page content extracted, length:', pageContent.length);

    // 检查是否为 draw.io XML
    if (!isDrawioXML(pageContent)) {
      console.log('Page content is not a valid draw.io XML');
      return;
    }

    console.log('✓ Valid draw.io XML detected!');

    // 提取 XML 内容
    const xmlContent = extractDrawioXML(pageContent);
    
    if (!xmlContent) {
      console.error('Failed to extract draw.io XML');
      return;
    }

    // 验证 XML 结构
    const validation = validateXMLStructure(xmlContent);
    
    if (!validation.isValid) {
      console.error('XML validation failed:', validation.error);
      return;
    }

    console.log('✓ XML structure validation passed');

    // 发送消息到 background script
    notifyBackgroundScript({
      type: 'DRAWIO_DETECTED',
      url: window.location.href,
      xmlLength: xmlContent.length,
    });

    // 存储 XML 内容供后续使用
    storeXMLContent(xmlContent);

    console.log('✓ Draw.io XML processed successfully');

    // 渲染 draw.io 图形
    await renderDrawioDiagram(xmlContent);
  } catch (error) {
    console.error('Error processing page:', error);
  }
}

/**
 * 获取页面文本内容
 * 优先从 <pre> 标签中提取（GitHub raw 文件通常使用 pre 标签）
 */
function getPageContent(): string | null {
  try {
    // 尝试从 <pre> 标签获取内容（适用于 GitHub raw 等）
    const preElement = document.querySelector('pre');
    if (preElement && preElement.textContent) {
      return preElement.textContent;
    }

    // 尝试从 <body> 获取纯文本内容
    const bodyText = document.body.textContent || document.body.innerText;
    if (bodyText) {
      return bodyText;
    }

    return null;
  } catch (error) {
    console.error('Error getting page content:', error);
    return null;
  }
}

/**
 * 通知 background script
 */
function notifyBackgroundScript(message: Record<string, any>): void {
  try {
    browser.runtime.sendMessage(message).catch((error) => {
      console.error('Failed to send message to background:', error);
    });
  } catch (error) {
    console.error('Error notifying background script:', error);
  }
}

/**
 * 存储 XML 内容到 sessionStorage
 * 供后续渲染使用
 */
function storeXMLContent(xmlContent: string): void {
  try {
    sessionStorage.setItem('drawio-xml-content', xmlContent);
    console.log('XML content stored in sessionStorage');
  } catch (error) {
    console.error('Failed to store XML content:', error);
  }
}

/**
 * 渲染 draw.io 图形
 */
async function renderDrawioDiagram(xmlContent: string): Promise<void> {
  try {
    console.log('Starting diagram rendering...');

    const renderer = createRenderer();

    await renderer.render({
      xmlContent,
      onProgress: (progress) => {
        console.log(`Rendering progress: ${progress}%`);
      },
      onError: (error) => {
        console.error('Rendering error:', error);
      },
    });

    console.log('✓ Diagram rendering completed');
  } catch (error) {
    console.error('Failed to render diagram:', error);
    throw error;
  }
}
