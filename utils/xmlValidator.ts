/**
 * XML 验证工具
 * 用于检测和验证 draw.io XML 格式
 */

/**
 * 检查文本内容是否为有效的 draw.io XML 格式
 * @param content 要检查的文本内容
 * @returns 如果是有效的 draw.io XML 则返回 true
 */
export function isDrawioXML(content: string): boolean {
  if (!content || typeof content !== 'string') {
    return false;
  }

  // 去除首尾空白字符
  const trimmedContent = content.trim();

  // 检查是否包含 mxGraphModel 标签（draw.io 的核心标签）
  const hasMxGraphModel = /<mxGraphModel[\s>]/.test(trimmedContent);
  
  // 检查是否包含 mxfile 标签（draw.io 文件的根标签）
  const hasMxFile = /<mxfile[\s>]/.test(trimmedContent);

  // 至少包含其中一个标签才认为是 draw.io XML
  return hasMxGraphModel || hasMxFile;
}

/**
 * 从文本内容中提取 draw.io XML
 * @param content 页面文本内容
 * @returns 提取的 XML 字符串，如果不是有效的 draw.io XML 则返回 null
 */
export function extractDrawioXML(content: string): string | null {
  if (!isDrawioXML(content)) {
    return null;
  }

  // 返回清理后的内容
  return content.trim();
}

/**
 * 验证 XML 格式的完整性
 * @param xml XML 字符串
 * @returns 验证结果对象
 */
export function validateXMLStructure(xml: string): {
  isValid: boolean;
  error?: string;
} {
  try {
    // 基本的 XML 格式检查
    if (!xml || xml.trim().length === 0) {
      return { isValid: false, error: 'XML content is empty' };
    }

    // 检查是否以 < 开头
    if (!xml.trim().startsWith('<')) {
      return { isValid: false, error: 'XML must start with <' };
    }

    // 检查基本的标签配对（简单验证）
    const openTags = xml.match(/<[^/][^>]*>/g) || [];
    const closeTags = xml.match(/<\/[^>]+>/g) || [];
    
    // 自闭合标签不需要闭合标签
    const selfClosingTags = xml.match(/<[^>]+\/>/g) || [];
    
    // 粗略检查标签数量（不是精确验证，但可以发现明显错误）
    const expectedCloseTags = openTags.length - selfClosingTags.length;
    if (closeTags.length < expectedCloseTags * 0.5) {
      return { isValid: false, error: 'Possible unclosed tags detected' };
    }

    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Unknown validation error' 
    };
  }
}
