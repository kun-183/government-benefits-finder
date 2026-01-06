// 사용자 조건에 맞는 서비스 필터링
export const filterServicesByConditions = (services, conditions) => {
  if (!services || services.length === 0) {
    return [];
  }

  return services.filter(service => {
    // 조건이 모두 비어있으면 전체 표시
    const hasAnyCondition = Object.values(conditions).some(val => val !== '');
    if (!hasAnyCondition) {
      return true;
    }

    // 각 필드를 소문자로 변환하여 검색
    const 서비스내용 = (service.서비스내용 || '').toLowerCase();
    const 지원대상 = (service.지원대상 || '').toLowerCase();
    const 선정기준 = (service.선정기준 || '').toLowerCase();
    const 서비스목적요약 = (service.서비스목적요약 || '').toLowerCase();
    const 신청방법 = (service.신청방법 || '').toLowerCase();

    // 모든 텍스트 합치기
    const allText = `${서비스내용} ${지원대상} ${선정기준} ${서비스목적요약} ${신청방법}`;

    let matches = true;

    // 나이 조건
    if (conditions.age) {
      const age = parseInt(conditions.age);

      // 나이 범위 추출 (예: "만 19세 ~ 34세", "39세 이하", "40세 이상")
      const agePattern = /(\d+)세?\s*[~-]\s*(\d+)세?|(\d+)세?\s*이하|(\d+)세?\s*이상|만?\s*(\d+)세?/g;
      const ageMatches = allText.match(agePattern);

      if (ageMatches) {
        let ageMatch = false;

        ageMatches.forEach(match => {
          // 범위 (예: 19세~34세)
          const rangeMatch = match.match(/(\d+)세?\s*[~-]\s*(\d+)세?/);
          if (rangeMatch) {
            const min = parseInt(rangeMatch[1]);
            const max = parseInt(rangeMatch[2]);
            if (age >= min && age <= max) ageMatch = true;
          }

          // 이하 (예: 39세 이하)
          const belowMatch = match.match(/(\d+)세?\s*이하/);
          if (belowMatch) {
            const max = parseInt(belowMatch[1]);
            if (age <= max) ageMatch = true;
          }

          // 이상 (예: 40세 이상)
          const aboveMatch = match.match(/(\d+)세?\s*이상/);
          if (aboveMatch) {
            const min = parseInt(aboveMatch[1]);
            if (age >= min) ageMatch = true;
          }
        });

        if (!ageMatch) matches = false;
      }
    }

    // 지역 조건
    if (conditions.region) {
      const region = conditions.region.toLowerCase();
      if (!allText.includes(region) && !allText.includes('전국')) {
        matches = false;
      }
    }

    // 취업 상태
    if (conditions.employment) {
      const employment = conditions.employment.toLowerCase();
      const keywords = {
        '미취업': ['미취업', '실업', '구직'],
        '취업': ['취업', '재직', '근로'],
        '재직': ['재직', '근로자'],
        '구직': ['구직', '미취업', '실업'],
        '창업': ['창업', '사업자']
      };

      const searchWords = keywords[conditions.employment] || [employment];
      const employmentMatch = searchWords.some(word => allText.includes(word));

      if (!employmentMatch && !allText.includes('제한없음') && !allText.includes('무관')) {
        matches = false;
      }
    }

    // 소득 수준
    if (conditions.income) {
      const incomeKeywords = {
        '기초생활수급자': ['기초생활수급', '수급자', '기초수급'],
        '차상위': ['차상위'],
        '중위소득50': ['중위소득', '50%', '50'],
        '중위소득80': ['중위소득', '80%', '80'],
        '중위소득100': ['중위소득', '100%', '100'],
        '중위소득150': ['중위소득', '150%', '150'],
        '제한없음': []
      };

      const searchWords = incomeKeywords[conditions.income] || [];
      if (searchWords.length > 0) {
        const incomeMatch = searchWords.some(word => allText.includes(word));
        if (!incomeMatch && !allText.includes('소득무관') && !allText.includes('제한없음')) {
          matches = false;
        }
      }
    }

    // 학력
    if (conditions.education) {
      const educationKeywords = {
        '중졸이하': ['중졸', '학력무관'],
        '고졸': ['고졸', '고등학교', '학력무관'],
        '대학재학': ['대학', '재학', '학력무관'],
        '대졸': ['대졸', '대학교', '학사', '학력무관'],
        '대학원': ['대학원', '석사', '박사', '학력무관']
      };

      const searchWords = educationKeywords[conditions.education] || [];
      if (searchWords.length > 0 && !searchWords.some(word => allText.includes(word))) {
        // 학력 언급이 없으면 통과
        const hasEducationMention = allText.includes('학력') || allText.includes('졸업');
        if (hasEducationMention) {
          matches = false;
        }
      }
    }

    // 자녀 유무
    if (conditions.hasChildren === '있음') {
      if (allText.includes('자녀') || allText.includes('아동') || allText.includes('육아')) {
        // 자녀 관련 내용이 있으면 통과
      } else {
        // 자녀 언급이 없으면 제한이 없는 것으로 간주하여 통과
      }
    }

    // 장애 여부
    if (conditions.disability === '해당') {
      if (!allText.includes('장애')) {
        // 장애 언급이 없으면 제한이 없는 것으로 간주하여 통과
      }
    } else if (conditions.disability === '비해당') {
      if (allText.includes('장애인') && !allText.includes('제외')) {
        matches = false;
      }
    }

    return matches;
  });
};

// 필터링된 결과 개수 반환
export const getFilteredCount = (services, conditions) => {
  return filterServicesByConditions(services, conditions).length;
};
