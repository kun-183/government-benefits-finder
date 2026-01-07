// 사용자 조건에 맞는 서비스 필터링

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const filterServicesByConditions = (services, conditions) => {
  if (!services || services.length === 0) return [];

  return services.filter(service => {
    // 조건이 모두 비어있으면 전체 표시
    const hasAnyCondition = Object.values(conditions).some(val => val !== '');
    if (!hasAnyCondition) return true;

    // 각 필드를 소문자로 변환하여 검색
    const 서비스내용 = (service.서비스내용 || '').toLowerCase();
    const 지원대상 = (service.지원대상 || '').toLowerCase();
    const 선정기준 = (service.선정기준 || '').toLowerCase();
    const 서비스목적요약 = (service.서비스목적요약 || '').toLowerCase();
    const 신청방법 = (service.신청방법 || '').toLowerCase();
    const 기타 = `${service.서비스명 || ''} ${service.소관기관명 || ''} ${service.접수기관명 || ''}`.toLowerCase();

    // 모든 텍스트 합치기
    const allText = `${서비스내용} ${지원대상} ${선정기준} ${서비스목적요약} ${신청방법} ${기타}`;

    // 나이 조건
    if (conditions.age) {
      const age = parseInt(conditions.age);

      // 나이 범위 추출 (예: "만 19세 ~ 34세", "39세 이하", "40세 이상")
      const agePattern = /(\d{1,3})\s*세?\s*[~-]\s*(\d{1,3})\s*세?|(\d{1,3})\s*세?\s*이하|(\d{1,3})\s*세?\s*이상|만?\s*(\d{1,3})\s*세?/g;
      const ageMatches = allText.match(agePattern);

      if (ageMatches && ageMatches.length > 0) {
        let ageMatch = false;

        ageMatches.forEach(match => {
          const rangeMatch = match.match(/(\d{1,3})\s*세?\s*[~-]\s*(\d{1,3})\s*세?/);
          if (rangeMatch) {
            const min = parseInt(rangeMatch[1]);
            const max = parseInt(rangeMatch[2]);
            if (age >= min && age <= max) ageMatch = true;
          }

          const belowMatch = match.match(/(\d{1,3})\s*세?\s*이하/);
          if (belowMatch) {
            const max = parseInt(belowMatch[1]);
            if (age <= max) ageMatch = true;
          }

          const aboveMatch = match.match(/(\d{1,3})\s*세?\s*이상/);
          if (aboveMatch) {
            const min = parseInt(aboveMatch[1]);
            if (age >= min) ageMatch = true;
          }

          const singleMatch = match.match(/만?\s*(\d{1,3})\s*세?/);
          if (singleMatch) {
            const value = parseInt(singleMatch[1]);
            if (age === value) ageMatch = true;
          }
        });

        if (!ageMatch) return false;
      } else {
        // 연령 관련 명시가 없을 때는 기존처럼 통과시키되, '연령무관' 반영
        if (/(^|\s|\W)(연령무관|연령 제한 없음|연령제한없음)($|\s|\W)/.test(allText) === false) {
          // no explicit age info; keep previous behavior (do not exclude)
        }
      }
    }

    // 지역 조건
    if (conditions.region) {
      const region = conditions.region.toLowerCase();
      if (!allText.includes(region) && !allText.includes('전국')) return false;
    }

    // 취업 상태
    if (conditions.employment) {
      const keywords = {
        '미취업': ['미취업', '실업', '구직'],
        '취업': ['취업', '재직', '근로'],
        '재직': ['재직', '근로자'],
        '구직': ['구직', '미취업', '실업'],
        '창업': ['창업', '사업자']
      };

      const searchWords = keywords[conditions.employment] || [conditions.employment];
      const employmentMatch = searchWords.some(word => new RegExp(`(^|\\s|\\W)${escapeRegExp(word)}($|\\s|\\W)`).test(allText));

      if (!employmentMatch && !/제한없음|무관/.test(allText)) return false;
    }

    // 소득 수준 (정교한 패턴 사용)
    if (conditions.income) {
      const incomePatterns = {
        '기초생활수급자': /(기초생활수급|수급자|기초수급)/,
        '차상위': /차상위/,
        '중위소득50': /(중위소득.*50%?|50\s*%)/,
        '중위소득80': /(중위소득.*80%?|80\s*%)/,
        '중위소득100': /(중위소득.*100%?|100\s*%)/,
        '중위소득150': /(중위소득.*150%?|150\s*%)/,
        '제한없음': null
      };

      const pat = incomePatterns[conditions.income];
      if (pat) {
        if (!pat.test(allText) && !/소득무관|제한없음/.test(allText)) return false;
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
      if (searchWords.length > 0 && !searchWords.some(word => new RegExp(`(^|\\s|\\W)${escapeRegExp(word)}($|\\s|\\W)`).test(allText))) {
        const hasEducationMention = /(^|\s|\W)(학력|졸업|학위)($|\s|\W)/.test(allText);
        if (hasEducationMention) return false;
      }
    }

    // 자녀 유무 - '있음'은 자녀 관련 언급이 반드시 있어야 함
    if (conditions.hasChildren === '있음') {
      if (!/(^|\s|\W)(자녀|아동|육아|양육)($|\s|\W)/.test(allText)) return false;
    } else if (conditions.hasChildren === '없음') {
      if (/(^|\s|\W)(자녀|아동|육아|양육)($|\s|\W)/.test(allText) && !/제외/.test(allText)) return false;
    }

    // 장애 여부
    if (conditions.disability === '해당') {
      if (!/(^|\s|\W)(장애|장애인)($|\s|\W)/.test(allText)) return false;
    } else if (conditions.disability === '비해당') {
      if (/(^|\s|\W)장애인($|\s|\W)/.test(allText) && !/제외/.test(allText)) return false;
    }

    return true;
  });
};

// 필터링된 결과 개수 반환
export const getFilteredCount = (services, conditions) => {
  return filterServicesByConditions(services, conditions).length;
};
