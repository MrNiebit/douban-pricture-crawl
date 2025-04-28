# 豆瓣图书图片搜索

这是一个使用Next.js开发的图书图片搜索和下载系统。用户可以通过输入书名搜索豆瓣上的相关图片，并以瀑布流布局展示，支持点击下载功能。

## 功能特点

- 简洁的搜索界面，顶部居中搜索框和搜索按钮
- 瀑布流布局展示搜索结果图片
- 支持图片点击下载功能
- 响应式设计，适配不同设备

## 技术栈

- 前端：Next.js、React、TypeScript、Tailwind CSS
- 后端：Next.js API Routes

## 使用说明

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 运行生产版本

```bash
npm start
```

## 自定义爬虫逻辑

在 `src/app/api/search/route.ts` 文件中，您需要自行实现 `crawlDoubanImages` 函数来爬取豆瓣上的图片。目前该函数返回的是示例数据，您需要根据自己的需求修改为真实的爬虫逻辑。

```typescript
async function crawlDoubanImages(bookName: string) {
  // 在这里实现您的爬虫逻辑
  // 返回格式应为 Array<{ id: string; url: string; title: string }>
}
```

## 注意事项

- 请遵守豆瓣的使用条款和爬虫规则
- 建议添加适当的请求延迟和错误处理，避免频繁请求导致IP被封
- 仅用于个人学习和研究，请勿用于商业用途
