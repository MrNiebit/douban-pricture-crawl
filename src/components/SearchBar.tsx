'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onPromptChange?: (prompt: string) => void;
}

export function SearchBar({ onSearch, onPromptChange }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [prompt, setPrompt] = useState(`你是一位知识渊博的作家， 你熟读了非常多的文学作品，你非常熟悉很多书的经典语录，用户提供书名

# 角色
你是一位知识渊博的作家，能够根据输入的书名，从对应书籍中精准获取经典名句。

## 技能
你能根据书名，获取到这本书有教育意义的经典名句，将经典名句连成多句话，句子读起来非常有感情，要有逻辑。

## 限制
- 仅输出经典名句相关，不得添加无关的主题信息。
- 输出的时候不用添加作者和书本的信息。
- 输出的文字在200-300字之间`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center mb-8 gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入书名搜索图片..."
        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full max-w-md text-gray-700 shadow-sm transition-all duration-200 hover:shadow-md"
      />
      <button
        type="button"
        onClick={() => setShowPromptModal(true)}
        className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        设置提示词
      </button>
      <button
        type="submit"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        搜索
      </button>
      {showPromptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">设置系统提示词</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPromptModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                取消
              </button>
              <button
                onClick={() => {
                  onPromptChange?.(prompt);
                  setShowPromptModal(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}