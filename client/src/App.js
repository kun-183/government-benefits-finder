import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import PolicyList from './components/PolicyList';
import PolicyDetail from './components/PolicyDetail';
import UserConditionForm from './components/UserConditionForm';
import { filterServicesByConditions } from './utils/filterServices';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [userConditions, setUserConditions] = useState({
    age: '',
    region: '',
    employment: '',
    income: '',
    education: '',
    hasChildren: '',
    disability: ''
  });

  const [searchParams, setSearchParams] = useState({
    page: 1,
    perPage: 100 // 더 많은 데이터를 가져와서 필터링
  });

  // 공공서비스 검색
  const searchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: searchParams.page,
        perPage: searchParams.perPage
      };

      const response = await axios.get(`${API_BASE_URL}/services`, { params });

      console.log('API 응답:', response.data);

      // API 응답 구조에 따라 데이터 추출
      if (response.data.data) {
        setServices(response.data.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      setError('정책 정보를 불러오는데 실패했습니다. API 키를 확인해주세요.');
      console.error('검색 오류:', err);
      console.error('오류 응답:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // 서비스 상세 조회
  const viewServiceDetail = async (serviceId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services/${serviceId}`);
      setSelectedService(response.data);
    } catch (err) {
      setError('상세 정보를 불러오는데 실패했습니다.');
      console.error('상세 조회 오류:', err);
    }
  };

  // 조건 변경 핸들러
  const handleConditionChange = (newConditions) => {
    setUserConditions(newConditions);
  };

  // 필터링된 서비스 목록 (useMemo로 최적화)
  const filteredServices = useMemo(() => {
    return filterServicesByConditions(services, userConditions);
  }, [services, userConditions]);

  useEffect(() => {
    searchServices();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">🇰🇷 정부 혜택 찾기</h1>
          <p className="mt-2 text-blue-100">대한민국 공공서비스(혜택) 정보를 찾아보세요</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* 사용자 조건 입력 폼 */}
        <UserConditionForm onConditionChange={handleConditionChange} />

        {/* 필터링 결과 표시 */}
        {!loading && services.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6">
            <p className="font-medium">
              전체 {services.length}건 중 내 조건에 맞는 서비스: {filteredServices.length}건
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">정책 정보를 불러오는 중...</p>
          </div>
        )}

        {/* Results */}
        {!loading && !selectedService && (
          <PolicyList
            policies={filteredServices}
            onViewDetail={viewServiceDetail}
          />
        )}

        {/* Service Detail Modal */}
        {selectedService && (
          <PolicyDetail
            policy={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16 py-6">
        <div className="container mx-auto px-4 text-center">
          <p>공공데이터포털 API 기반 정부 혜택 정보 제공</p>
          <p className="mt-2 text-gray-400 text-sm">
            데이터 출처: 행정안전부 대한민국 공공서비스(혜택) 정보
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
