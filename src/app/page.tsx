'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { ImageGallery } from '@/components/ImageGallery';

export default function Home() {
  const [images, setImages] = useState<Array<{ id: string; url: string; title: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [llmResponse, setLlmResponse] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(`你是一位知识渊博的作家， 你熟读了非常多的文学作品，你非常熟悉很多书的经典语录，用户提供书名

# 角色
你是一位知识渊博的作家，能够根据输入的书名，从对应书籍中精准获取经典名句。

## 技能
你能根据书名，获取到这本书有教育意义的经典名句，将经典名句连成多句话，句子读起来非常有感情，要有逻辑。

## 限制
- 仅输出经典名句相关，不得添加无关的主题信息。
- 输出的时候不用添加作者和书本的信息。
- 输出的文字在200-300字之间`);

  const handleSearch = async (bookName: string) => {
    if (!bookName.trim()) {
      setError('请输入书名');
      return;
    }

    setLoading(true);
    setError('');
    setLlmResponse('');
    
    try {
      const [imageResponse, llmResponse] = await Promise.all([
        fetch(`/api/search?bookName=${encodeURIComponent(bookName)}`),
        fetch('/api/llm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookName,
            systemPrompt
          })
        })
      ]);

      // 处理图片响应
      if (!imageResponse.ok) {
        throw new Error('搜索失败，请稍后再试');
      }
      try {
        const imageData = await imageResponse.json();
        setImages(imageData);
  
      } finally {
        setLoading(false);
      }

      // 处理LLM响应
      if (!llmResponse.ok || !llmResponse.body) {
        throw new Error('LLM请求失败');
      }
      
      const reader = llmResponse.body.getReader();
      const decoder = new TextDecoder();
      let responseText = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.data) {
                responseText += data.data;
                setLlmResponse(responseText);
              }
            } catch (e) {
              console.error('解析SSE数据失败:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('搜索出错:', err);
      setError('搜索出错，请稍后再试');
    }
  };
  
  const handlePromptChange = (prompt: string) => {
    setSystemPrompt(prompt);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(llmResponse);
    
    // 显示临时消息框
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed top-4 right-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg z-50';
    messageBox.textContent = '已复制到剪贴板';
    document.body.appendChild(messageBox);
    
    // 2秒后自动移除
    setTimeout(() => {
      messageBox.remove();
    }, 2000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-8">豆瓣图书图片搜索</h1>
        
        <SearchBar onSearch={handleSearch} onPromptChange={handlePromptChange} />
        
        {error && (
          <div className="text-red-500 text-center my-4">{error}</div>
        )}
        
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {llmResponse && (
              <div className="w-full mb-8">
                <div className="mb-2">
                  <h2 className="text-xl font-semibold">文案生成</h2>

                </div>
                <div 
                  className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={copyToClipboard}
                >
                  {llmResponse}
                </div>
              </div>
            )}
            <ImageGallery images={images} />
          </>
        )}
      </div>
    </main>
  );
}
