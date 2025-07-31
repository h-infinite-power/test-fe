# Next.js 클라이언트 상태 관리 및 페이지 새로고침 문제 해결 가이드

이 디렉토리에는 Next.js 애플리케이션에서 클라이언트 상태 관리와 페이지 새로고침 문제 해결에 관한 문서가 포함되어 있습니다.

## 목차

1. [localStorage 사용 가이드](./local-storage-guide.md)
   - localStorage를 안전하게 사용하는 방법
   - 함수형 초기화를 통한 상태 관리
   - 상태와 localStorage 동기화

2. [페이지 새로고침 문제 해결 사례](./refresh-problem-solution.md)
   - 실제 프로젝트에서 발생한 문제 상황
   - 적용한 해결책과 코드 예시
   - 개선 결과 및 권장 사항

3. [Next.js 클라이언트 상태 관리 가이드](./nextjs-client-state-management.md)
   - 서버 사이드 렌더링과 클라이언트 사이드 렌더링 차이 이해
   - 커스텀 훅을 통한 상태 관리
   - 하이드레이션 오류 방지 전략

## 핵심 내용 요약

Next.js에서 페이지 새로고침 시 404 오류 또는 상태 손실 문제가 발생하는 주요 원인:

1. **서버 사이드 렌더링과 클라이언트 사이드 렌더링의 차이**
   - 서버에서는 `window`, `localStorage` 등의 브라우저 API에 접근할 수 없음
   - 초기 렌더링과 클라이언트 사이드 렌더링의 결과가 다를 수 있음

2. **잘못된 localStorage 접근 방식**
   - 함수형 초기화 대신 일반 초기값 사용
   - useEffect에서만 localStorage 값을 읽어오는 방식
   - 상태 변경 시 localStorage 업데이트 누락

3. **하이드레이션 문제**
   - 서버에서 렌더링된 HTML과 클라이언트에서 렌더링된 React 트리의 불일치

해결 방법:

1. **useState 함수형 초기화 사용**
   ```typescript
   const [state, setState] = useState(() => {
     if (typeof window !== 'undefined') {
       const stored = localStorage.getItem('key');
       return stored ? JSON.parse(stored) : defaultValue;
     }
     return defaultValue;
   });
   ```

2. **상태와 localStorage 동기화**
   ```typescript
   useEffect(() => {
     if (typeof window !== 'undefined' && state) {
       localStorage.setItem('key', JSON.stringify(state));
     }
   }, [state]);
   ```

3. **안전한 클라이언트 사이드 렌더링 감지**
   ```typescript
   const [mounted, setMounted] = useState(false);
   
   useEffect(() => {
     setMounted(true);
   }, []);
   
   if (!mounted) {
     return <LoadingUI />; // 또는 빈 컴포넌트
   }
   ```

이러한 패턴을 일관되게 적용하면 Next.js 애플리케이션에서 localStorage를 사용할 때 발생하는 새로고침 관련 문제를 효과적으로 해결할 수 있습니다.
