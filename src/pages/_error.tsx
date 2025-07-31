import { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';

interface ErrorProps {
  statusCode?: number;
  title?: string;
}

const Error: NextPage<ErrorProps> = ({ statusCode, title }) => {
  return (
    <>
      <Head>
        <title>{statusCode ? `${statusCode} 오류` : '애플리케이션 오류'}</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <svg
              className="h-24 w-24 text-indigo-500 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {statusCode
              ? `${statusCode} - ${
                  statusCode === 404 ? '페이지를 찾을 수 없습니다' : '서버 오류'
                }`
              : '애플리케이션 오류'}
          </h1>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {statusCode
              ? `${statusCode} - ${
                  statusCode === 404 ? '페이지를 찾을 수 없습니다' : '서버 오류'
                }`
              : '애플리케이션 오류'}
          </h1>
          <p className="text-gray-600 mb-6">
            {title || '페이지를 표시하는 중에 문제가 발생했습니다.'}
          </p>
          <Link href="/">
            <span className="block bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer">
              홈으로 돌아가기
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
