import { useState } from 'react';

function UserConditionForm({ onConditionChange }) {
  const [conditions, setConditions] = useState({
    age: '',
    region: '',
    employment: '',
    income: '',
    education: '',
    hasChildren: '',
    disability: ''
  });

  const [showForm, setShowForm] = useState(false);

  const handleChange = (field, value) => {
    const newConditions = { ...conditions, [field]: value };
    setConditions(newConditions);
    onConditionChange(newConditions);
  };

  const handleReset = () => {
    const emptyConditions = {
      age: '',
      region: '',
      employment: '',
      income: '',
      education: '',
      hasChildren: '',
      disability: ''
    };
    setConditions(emptyConditions);
    onConditionChange(emptyConditions);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">내 조건 입력</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {showForm ? '접기 ▲' : '펼치기 ▼'}
        </button>
      </div>

      {showForm && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 나이 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                나이
              </label>
              <input
                type="number"
                value={conditions.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="예: 25"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 지역 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                거주 지역
              </label>
              <select
                value={conditions.region}
                onChange={(e) => handleChange('region', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="서울">서울특별시</option>
                <option value="부산">부산광역시</option>
                <option value="대구">대구광역시</option>
                <option value="인천">인천광역시</option>
                <option value="광주">광주광역시</option>
                <option value="대전">대전광역시</option>
                <option value="울산">울산광역시</option>
                <option value="세종">세종특별자치시</option>
                <option value="경기">경기도</option>
                <option value="강원">강원도</option>
                <option value="충북">충청북도</option>
                <option value="충남">충청남도</option>
                <option value="전북">전라북도</option>
                <option value="전남">전라남도</option>
                <option value="경북">경상북도</option>
                <option value="경남">경상남도</option>
                <option value="제주">제주특별자치도</option>
              </select>
            </div>

            {/* 취업 상태 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                취업 상태
              </label>
              <select
                value={conditions.employment}
                onChange={(e) => handleChange('employment', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="미취업">미취업</option>
                <option value="취업">취업</option>
                <option value="재직">재직 중</option>
                <option value="구직">구직 중</option>
                <option value="창업">창업</option>
              </select>
            </div>

            {/* 소득 수준 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                소득 수준
              </label>
              <select
                value={conditions.income}
                onChange={(e) => handleChange('income', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="기초생활수급자">기초생활수급자</option>
                <option value="차상위">차상위계층</option>
                <option value="중위소득50">중위소득 50% 이하</option>
                <option value="중위소득80">중위소득 80% 이하</option>
                <option value="중위소득100">중위소득 100% 이하</option>
                <option value="중위소득150">중위소득 150% 이하</option>
                <option value="제한없음">소득 제한 없음</option>
              </select>
            </div>

            {/* 학력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                학력
              </label>
              <select
                value={conditions.education}
                onChange={(e) => handleChange('education', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="중졸이하">중학교 졸업 이하</option>
                <option value="고졸">고등학교 졸업</option>
                <option value="대학재학">대학 재학</option>
                <option value="대졸">대학교 졸업</option>
                <option value="대학원">대학원 이상</option>
              </select>
            </div>

            {/* 자녀 유무 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자녀 유무
              </label>
              <select
                value={conditions.hasChildren}
                onChange={(e) => handleChange('hasChildren', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="있음">있음</option>
                <option value="없음">없음</option>
              </select>
            </div>

            {/* 장애 여부 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                장애 여부
              </label>
              <select
                value={conditions.disability}
                onChange={(e) => handleChange('disability', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">전체</option>
                <option value="해당">장애인</option>
                <option value="비해당">비장애인</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              조건 초기화
            </button>
            <div className="text-sm text-gray-600 flex items-center">
              입력한 조건에 맞는 서비스만 표시됩니다
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserConditionForm;
