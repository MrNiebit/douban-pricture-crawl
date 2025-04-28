'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageProps {
  images: Array<{ id: string; url: string; title: string }>;
}

// SVG Download Icon Component (Smaller)
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export function ImageGallery({ images }: ImageProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (url: string, title: string, id: string) => {
    try {
      setDownloading(id);
      const filename = `${title || 'image'}.jpg`;
      const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
      
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">
      {images.map((image) => (
        <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <div className="relative aspect-[3/4] w-full bg-gray-200">
            <Image
              src={image.url}
              alt={image.title || '书籍图片'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={images.indexOf(image) < 4} // Prioritize loading first few images
            />
            {/* Overlay and Download Icon (Bottom Right) */}
            <div 
              className="absolute bottom-0 right-0 p-2 cursor-pointer"
              onClick={() => !downloading && handleDownload(image.url, image.title, image.id)}
            >
              {downloading !== image.id ? (
                <DownloadIcon />
              ) : (
                // Adjusted spinner size to match icon
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div> 
              )}
            </div>
          </div>
          {/* Removed the title display div */}
        </div>
      ))}
    </div>
  );
}