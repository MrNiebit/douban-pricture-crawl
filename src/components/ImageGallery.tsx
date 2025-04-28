'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageProps {
  images: Array<{ id: string; url: string; title: string }>;
}

export function ImageGallery({ images }: ImageProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (url: string, title: string, id: string) => {
    try {
      setDownloading(id);
      // 使用服务器端API代理下载图片，解决跨域问题
      const filename = `${title || 'image'}.jpg`;
      const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
      
      // 创建一个隐藏的a标签并触发下载
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('下载图片失败:', error);
    } finally {
      setDownloading(null);
    }
  };

  if (images.length === 0) {
    return <div className="text-center my-8 text-gray-500">暂无图片，请搜索书名</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
      {images.map((image) => (
        <div key={image.id} className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={image.url}
              alt={image.title || '书籍图片'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="p-2 bg-white">
            <p className="text-sm truncate">{image.title || '未知书名'}</p>
            <button
              onClick={() => handleDownload(image.url, image.title, image.id)}
              disabled={downloading === image.id}
              className="mt-2 w-full py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {downloading === image.id ? '下载中...' : '下载'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}