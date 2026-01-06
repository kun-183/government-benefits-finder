import React from 'react';

function PolicyList({ policies, onViewDetail }) {
  if (!policies || policies.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 text-lg">공공서비스 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        공공서비스 목록 ({policies.length}건)
      </h2>
      {policies.map((service, index) => (
        <div
          key={service.서비스ID || index}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.서비스명 || '제목 없음'}
              </h3>
              <div className="flex gap-2 mb-3">
                {service.소관기관명 && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {service.소관기관명}
                  </span>
                )}
                {service.서비스목적요약 && (
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                    {service.서비스목적요약}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-3 line-clamp-2">
                {service.서비스내용 || '설명 없음'}
              </p>
              <div className="text-sm text-gray-500">
                {service.신청방법 && (
                  <p>신청방법: {service.신청방법}</p>
                )}
                {service.접수기관명 && (
                  <p>접수기관: {service.접수기관명}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => onViewDetail(service.서비스ID)}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              상세보기
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PolicyList;
