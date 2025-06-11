// Sidebar.js
import React, { useState } from 'react';
import HistoryList from './HistoryList';

const Sidebar = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="w-1/3 bg-gray-100 flex flex-col items-center p-4">
      <button
        className="mb-4 bg-blue-300 px-4 py-2 rounded hover:bg-blue-400"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? '잭슨 보기' : '질문 이력'}
      </button>

      {showHistory ? (
        <HistoryList />
      ) : (
        <div className="flex flex-col items-center">
          <img src="/jackson.png" alt="잭슨" className="w-48 h-auto" />
          <p className="mt-2 font-bold text-lg">잭슨</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

