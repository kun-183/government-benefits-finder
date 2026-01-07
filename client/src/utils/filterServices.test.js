import { filterServicesByConditions } from './filterServices';

describe('filterServicesByConditions', () => {
  test('중위소득50 matches services mentioning 50% but not arbitrary numbers', () => {
    const services = [
      { 서비스ID: 1, 서비스명: 'A', 서비스내용: '중위소득 50% 이하 대상' },
      { 서비스ID: 2, 서비스명: 'B', 서비스내용: '월 50만원 지원 대상' }
    ];

    const filtered = filterServicesByConditions(services, {
      age: '',
      region: '',
      employment: '',
      income: '중위소득50',
      education: '',
      hasChildren: '',
      disability: ''
    });

    expect(filtered.map(s => s.서비스ID)).toEqual([1]);
  });

  test("hasChildren='있음' excludes services without child-related mentions", () => {
    const services = [
      { 서비스ID: 1, 서비스명: 'A', 서비스내용: '청년 지원 프로그램' },
      { 서비스ID: 2, 서비스명: 'B', 서비스내용: '자녀가 있는 가구 대상 지원' }
    ];

    const filtered = filterServicesByConditions(services, {
      age: '',
      region: '',
      employment: '',
      income: '',
      education: '',
      hasChildren: '있음',
      disability: ''
    });

    expect(filtered.map(s => s.서비스ID)).toEqual([2]);
  });

  test("disability='해당' requires explicit mention", () => {
    const services = [
      { 서비스ID: 1, 서비스명: 'A', 서비스내용: '장애인 대상 지원' },
      { 서비스ID: 2, 서비스명: 'B', 서비스내용: '일반 청년 지원' }
    ];

    const filtered = filterServicesByConditions(services, {
      age: '',
      region: '',
      employment: '',
      income: '',
      education: '',
      hasChildren: '',
      disability: '해당'
    });

    expect(filtered.map(s => s.서비스ID)).toEqual([1]);
  });

  test("employment '미취업' matches '구직' keywords", () => {
    const services = [
      { 서비스ID: 1, 서비스명: 'A', 서비스내용: '구직자 대상 취업 지원' },
      { 서비스ID: 2, 서비스명: 'B', 서비스내용: '재직자 대상 프로그램' }
    ];

    const filtered = filterServicesByConditions(services, {
      age: '',
      region: '',
      employment: '미취업',
      income: '',
      education: '',
      hasChildren: '',
      disability: ''
    });

    expect(filtered.map(s => s.서비스ID)).toEqual([1]);
  });
});