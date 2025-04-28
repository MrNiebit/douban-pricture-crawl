'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (bookName: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [bookName, setBookName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(bookName);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center mb-8">
      <div className="flex w-full max-w-md">
        <input
          type="text"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          placeholder="输入书名搜索"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          搜索
        </button>
      </div>
    </form>
  );
}