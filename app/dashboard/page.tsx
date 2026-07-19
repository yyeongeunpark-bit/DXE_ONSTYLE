import React from 'react';
import Link from 'next/link';

export default function DashboardHomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gray-50">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">ONSTYLE 마케팅 랩</h1>
        <p className="text-gray-500 mt-2 text-sm">사용하실 광고 자동화 툴을 선택하세요.</p>
      </div>

      {/* 가로로 나란히 배치되며 화면 정중앙에 위치하는 메뉴 폴더링 */}
      <div className="flex flex-col sm:flex-row gap-8 max-w-3xl w-full justify-center">
        
        {/* AI 카피라이터 카드 */}
        <Link href="/dashboard/copywriter" className="group w-full sm:w-72 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center">
          <span className="text-5xl mb-4 transition-transform group-hover:scale-110">✍️</span>
          <h2 className="text-lg font-bold text-gray-900 mb-1">AI 카피라이터 구동기</h2>
          <span className="text-xs text-indigo-500 font-semibold mt-3 group-hover:text-indigo-700">바로가기 &rarr;</span>
        </Link>

        {/* 예산 시뮬레이터 카드 */}
        <Link href="/dashboard/simulator" className="group w-full sm:w-72 p-8 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center">
          <span className="text-5xl mb-4 transition-transform group-hover:scale-110">📊</span>
          <h2 className="text-lg font-bold text-gray-900 mb-1">예산 시뮬레이터 툴</h2>
          <span className="text-xs text-indigo-500 font-semibold mt-3 group-hover:text-indigo-700">바로가기 &rarr;</span>
        </Link>

      </div>
    </div>
  );
}