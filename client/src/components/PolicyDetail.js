import React from 'react';

function PolicyDetail({ policy, onClose }) {
  const detail = policy.data || policy || {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {detail.서비스명 || '서비스 상세 정보'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* 기본 정보 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">기본 정보</h3>
            <div className="space-y-2 text-gray-700">
              {detail.소관기관명 && (
                <div>
                  <span className="font-medium">소관기관:</span> {detail.소관기관명}
                </div>
              )}
              {detail.접수기관명 && (
                <div>
                  <span className="font-medium">접수기관:</span> {detail.접수기관명}
                </div>
              )}
              {detail.서비스목적요약 && (
                <div>
                  <span className="font-medium">서비스 목적:</span> {detail.서비스목적요약}
                </div>
              )}
            </div>
          </div>

          {/* 서비스 내용 */}
          {detail.서비스내용 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">서비스 내용</h3>
              <p className="text-gray-700 whitespace-pre-line">{detail.서비스내용}</p>
            </div>
          )}

          {/* 지원 형태 */}
          {detail.지원형태 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">지원 형태</h3>
              <p className="text-gray-700 whitespace-pre-line">{detail.지원형태}</p>
            </div>
          )}

          {/* 지원 대상 */}
          {detail.지원대상 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">지원 대상</h3>
              <p className="text-gray-700 whitespace-pre-line">{detail.지원대상}</p>
            </div>
          )}

          {/* 선정 기준 */}
          {detail.선정기준 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">선정 기준</h3>
              <p className="text-gray-700 whitespace-pre-line">{detail.선정기준}</p>
            </div>
          )}

          {/* 신청 방법 */}
          {detail.신청방법 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">신청 방법</h3>
              <p className="text-gray-700 whitespace-pre-line">{detail.신청방법}</p>
            </div>
          )}

          {/* 구비 서류 */}
          {detail.구비서류 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">구비 서류</h3>
              <p className="text-gray-700 whitespace-pre-line">{detail.구비서류}</p>
            </div>
          )}

          {/* 신청 기한 */}
          {detail.신청기한 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">신청 기한</h3>
              <p className="text-gray-700">{detail.신청기한}</p>
            </div>
          )}

          {/* 홈페이지 URL */}
          {detail.상세조회URL && (
            <div>
              <a
                href={detail.상세조회URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                상세 페이지 바로가기 →
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default PolicyDetail;
