import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import PolicyList from './components/PolicyList';
import PolicyDetail from './components/PolicyDetail';
import UserConditionForm from './components/UserConditionForm';
import SearchBar from './components/SearchBar';
import FilterSection from './components/FilterSection';
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

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPolicyType, setSelectedPolicyType] = useState('');

  const [categories] = useState([
    { code: '일자리', name: '일자리' },
    { code: '주거', name: '주거' },
    { code: '교육', name: '교육' },
    { code: '복지', name: '복지' },
    { code: '문화', name: '문화' }
  ]);

  const [policyTypes] = useState([
    { code: '지원사업', name: '지원사업' },
    { code: '일자리', name: '일자리' },
    { code: '상담', name: '상담' },
    { code: '정책자금', name: '정책자금' },
    { code: '시설', name: '시설·공간' }
  ]);

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleFilterChange = (type, value) => {
    if (type === 'category') setSelectedCategory(value);
    else if (type === 'policyType') setSelectedPolicyType(value);
  };

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
    let result = filterServicesByConditions(services, userConditions);

    // 검색 키워드로 필터
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      result = result.filter((srv) => {
        const text = `${srv.서비스명 || ''} ${srv.서비스내용 || ''} ${srv.서비스목적요약 || ''} ${srv.소관기관명 || ''}`.toLowerCase();
        return text.includes(kw);
      });
    }

    // 카테고리 필터 (서비스 설명/유형에서 매칭)
    if (selectedCategory) {
      const cat = selectedCategory.toLowerCase();
      result = result.filter((srv) => {
        const text = `${srv.서비스목적요약 || ''} ${srv.서비스유형 || ''} ${srv.정책분야 || ''}`.toLowerCase();
        return text.includes(cat);
      });
    }

    // 정책 유형 필터
    if (selectedPolicyType) {
      const pt = selectedPolicyType.toLowerCase();
      result = result.filter((srv) => {
        const text = `${srv.서비스유형 || ''} ${srv.사업유형 || ''}`.toLowerCase();
        return text.includes(pt);
      });
    }

    return result;
  }, [services, userConditions, searchKeyword, selectedCategory, selectedPolicyType]);

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

        {/* 검색 및 필터 */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />
          <div className="mt-4">
            <FilterSection
              categories={categories}
              policyTypes={policyTypes}
              selectedCategory={selectedCategory}
              selectedPolicyType={selectedPolicyType}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>

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
