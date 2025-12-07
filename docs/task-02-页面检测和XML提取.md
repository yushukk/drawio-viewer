# Task 02: 实现content script的页面检测和XML提取功能

## 工作目标
开发content script，实现对特定URL模式的监听页面，检测并提取页面中的draw.io XML内容。

## 具体工作内容
1. 创建content script文件
2. 实现URL模式匹配逻辑
3. 开发页面内容检测和XML提取功能
4. 添加XML格式初步验证

## 完成标准
- [ ] content script能在正确的URL模式下激活
- [ ] 能够正确读取页面文本内容
- [ ] 能够识别draw.io XML格式内容
- [ ] 实现基础的XML格式验证（检查是否包含<mxGraphModel>标签）
- [ ] content script与background script的通信正常

## 验收方法
1. 访问测试用的.drawio文件页面，确认content script被激活
2. 检查控制台输出，确认能正确提取页面内容
3. 使用不同格式的测试文件，验证XML检测准确性
4. 检查content script与background script的通信日志