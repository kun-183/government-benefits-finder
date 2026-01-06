import React from 'react';

function FilterSection({
  categories,
  policyTypes,
  selectedCategory,
  selectedPolicyType,
  onFilterChange
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 정책 분야 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          정책 분야
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">전체</option>
          {categories.map((cat) => (
            <option key={cat.code} value={cat.code}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 정책 유형 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          정책 유형
        </label>
        <select
          value={selectedPolicyType}
          onChange={(e) => onFilterChange('policyType', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">전체</option>
          {policyTypes.map((type) => (
            <option key={type.code} value={type.code}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterSection;
