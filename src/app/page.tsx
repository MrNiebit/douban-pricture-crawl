'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ImageGallery } from '@/components/ImageGallery';

export default function Home() {
  const [images, setImages] = useState<Array<{ id: string; url: string; title: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (bookName: string) => {
    if (!bookName.trim()) {
      setError('请输入书名');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/search?bookName=${encodeURIComponent(bookName)}`);
      
      if (!response.ok) {
        throw new Error('搜索失败，请稍后再试');
      }
      
      const data = await response.json();
      setImages(data);
    } catch (err) {
      console.error('搜索出错:', err);
      setError('搜索出错，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-8">豆瓣图书图片搜索</h1>
        
        <SearchBar onSearch={handleSearch} />
        
        {error && (
          <div className="text-red-500 text-center my-4">{error}</div>
        )}
        
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ImageGallery images={images} />
        )}
      </div>
    </main>
  );
}
