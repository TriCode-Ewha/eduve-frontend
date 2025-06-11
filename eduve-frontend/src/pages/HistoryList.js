import React from 'react';

const dummyHistory = [
  '누미노제는 뭐야?',
  '기독교와 세계관의 차이',
  '노미노제의 유형은?',
];

const HistoryList = () => {
  return (
    <div className="w-full">
      <h2 className="text-lg font-bold mb-2">과거 질문</h2>
      <ul className="space-y-2">
        {dummyHistory.map((item, index) => (
          <li
            key={index}
            className="bg-white p-2 rounded shadow hover:bg-gray-100 cursor-pointer"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryList;
