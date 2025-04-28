import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// 这个函数将由用户自己实现爬虫逻辑
async function crawlDoubanImages(bookName: string) {
  console.log(`搜索书名: ${bookName}`);
  
  try {
    // 请求豆瓣搜索页面
    const response = await fetch(`https://www.douban.com/search?cat=1001&q=${encodeURIComponent(bookName)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = await response.text();
    // console.log(html);
    // 使用cheerio解析HTML
    const $ = cheerio.load(html);
    const images: { id: string; url: string; title: string; }[] = [];
    let id = 1;
    
    // 获取所有图片元素
    const imgElements = $('.result-list > .result > .pic > a > img');
    imgElements.each((index, element) => {
      if (id <= 20) {
        const src = $(element).attr('src');
        if (src) {
          images.push({
            id: String(id++),
            url: src,
            title: ""
          });
        }
      }
    });
    
    return images;
  } catch (error) {
    console.error('爬取豆瓣图片出错:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookName = searchParams.get('bookName');

    if (!bookName) {
      return NextResponse.json(
        { error: '请提供书名参数' },
        { status: 400 }
      );
    }

    // 调用爬虫函数获取图片
    const images = await crawlDoubanImages(bookName);
    
    return NextResponse.json(images);
  } catch (error) {
    console.error('搜索处理出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}