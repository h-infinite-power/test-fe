import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://h-infinite-power.store',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    // GET 요청에 타임스탬프 추가하여 캐시 방지 (timestamp가 이미 있는 경우 제외)
    if (config.method === 'get' && !config.url?.includes('_t=')) {
      const separator = config.url?.includes('?') ? '&' : '?';
      config.url = `${config.url}${separator}_t=${new Date().getTime()}`;
    }
    
    // config.url에 큰 숫자 ID가 포함되어 있는지 디버깅
    if (config.url && config.url.includes('/test-attendances/')) {
      console.log('출석 상세 API 호출 URL:', config.url);
      console.log('baseURL:', apiClient.defaults.baseURL);
      console.log('전체 URL:', `${apiClient.defaults.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
