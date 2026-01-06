const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const xml2js = require('xml2js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 공공서비스 목록 조회 (행정안전부 API)
app.get('/api/services', async (req, res) => {
  try {
    const {
      page = 1,
      perPage = 10,
      serviceKey = '' // 검색 키워드
    } = req.query;

    const apiKey = process.env.YOUTH_POLICY_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.'
      });
    }

    // 행정안전부 공공서비스 API
    const apiUrl = 'https://api.odcloud.kr/api/gov24/v3/serviceList';

    const params = {
      serviceKey: apiKey,
      page: page,
      perPage: perPage
    };

    const response = await axios.get(apiUrl, {
      params,
      timeout: 10000
    });

    res.json(response.data);

  } catch (error) {
    console.error('API 요청 오류:', error.message);
    console.error('응답 데이터:', error.response?.data);
    res.status(500).json({
      error: '정책 정보를 가져오는데 실패했습니다.',
      details: error.message,
      response: error.response?.data
    });
  }
});

// 공공서비스 상세 조회
app.get('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = process.env.YOUTH_POLICY_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'API 키가 설정되지 않았습니다.'
      });
    }

    const apiUrl = 'https://api.odcloud.kr/api/gov24/v3/serviceDetail';

    const params = {
      serviceKey: apiKey,
      serviceId: id
    };

    const response = await axios.get(apiUrl, {
      params,
      timeout: 10000
    });

    res.json(response.data);

  } catch (error) {
    console.error('API 요청 오류:', error.message);
    res.status(500).json({
      error: '정책 상세 정보를 가져오는데 실패했습니다.',
      details: error.message
    });
  }
});

// 공공서비스 지원조건 조회
app.get('/api/services/:id/conditions', async (req, res) => {
  try {
    const { id } = req.params;
    const apiKey = process.env.YOUTH_POLICY_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'API 키가 설정되지 않았습니다.'
      });
    }

    const apiUrl = 'https://api.odcloud.kr/api/gov24/v3/supportConditions';

    const params = {
      serviceKey: apiKey,
      serviceId: id
    };

    const response = await axios.get(apiUrl, {
      params,
      timeout: 10000
    });

    res.json(response.data);

  } catch (error) {
    console.error('API 요청 오류:', error.message);
    res.status(500).json({
      error: '지원조건 정보를 가져오는데 실패했습니다.',
      details: error.message
    });
  }
});

// 서버 상태 확인
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: '서버가 정상 작동 중입니다.' });
});

app.listen(PORT, () => {
  console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`📋 API 키 설정 여부: ${process.env.YOUTH_POLICY_API_KEY ? '✓' : '✗'}`);
});
