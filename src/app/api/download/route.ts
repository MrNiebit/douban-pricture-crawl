import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const filename = searchParams.get('filename') || 'image.jpg';

    if (!imageUrl) {
      return NextResponse.json(
        { error: '请提供图片URL参数' },
        { status: 400 }
      );
    }

    // 获取图片
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: '获取图片失败' },
        { status: response.status }
      );
    }

    // 获取图片数据
    const arrayBuffer = await response.arrayBuffer();
    // 将ArrayBuffer转换为Uint8Array，以正确处理二进制数据
    // const uint8Array = new Uint8Array(arrayBuffer);
    
    // 设置响应头，使浏览器将响应作为下载处理
    // 对文件名进行URI编码，确保中文等非ASCII字符能够正确处理
    const encodedFilename = encodeURIComponent(filename);
    
    // 使用Buffer处理二进制数据，避免字符编码问题
    const buffer = Buffer.from(arrayBuffer);
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodedFilename}`,
      },
    });
  } catch (error) {
    console.error('下载图片处理出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}