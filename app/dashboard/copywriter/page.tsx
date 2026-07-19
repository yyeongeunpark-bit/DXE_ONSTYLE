'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface PlatformResult {
  meta1: string;
  meta2: string;
  demandgen: string;
  pmax: string;
  aci: string;
  tiktok: string;
}

interface HistoryItem {
  id: number;
  time: string;
  title: string;
  request: string;
  results: PlatformResult;
}

// 📜 기존에 사용하던 초기 히스토리 복구
const initialHistory: HistoryItem[] = [
  {
    id: 1,
    time: "16:10",
    title: "기획전 안 1",
    request: "브랜드명: 닥터포헤어 / 상품명: 폴리젠 샴푸 / 핵심 포인트: 탈모완화 증명, 두피 각질 개선 / 혜택: 단독 35% 할인 + 사은품 증정 / 타겟: 3040 직장인",
    results: {
      meta1: "매일 빠지는 모발로 스트레스받는다면 지금이 타이밍 ✨\n탈모 증상 완화 기능성 검증 완료! 닥터포헤어 폴리젠 샴푸로 두피부터 탄탄하게 케어하세요🖤\n\n✔ 인체 적용 시험으로 증명된 탈모 증상 완화 효과\n✔ 답답한 두피 각질과 유분기까지 시원하게 딥클렌징\n✔ 오직 온스타일에서만 만나는 단독 35% 한정 특가\n\n💎 CJ온스타일에서 닥터포헤어를 만나보세요",
      meta2: "거울 볼 때마다 휑해진 가르마가 신경 쓰였다면 ✨\n퇴근 후 지친 두피에 주는 완벽한 리프레시, 닥터포헤어 폴리젠 샴푸로 시작하는 건강한 두피 루틴🖤\n\n✔ 3040 직장인들의 무너진 두피 밸런스를 위한 맞춤 솔루션\n✔ 풍성한 거품으로 모근 끝까지 영양을 꽉 채우는 탄력 안심 케어",
      demandgen: "광고 제목 5개\n1. 단독 35% 할인 닥터포헤어\n2. 탈모완화 증명 폴리젠 샴푸\n3. CJ온스타일 단독 특가 행사\n4. 직장인 두피 각질 케어 솔루션\n5. 단 3일간 진행되는 한정 혜택",
      pmax: "광고 제목 5개\n1. 35% 특가 닥터포헤어 샴푸\n2. 탈모 완화 기능성 폴리젠",
      aci: "광고 제목 5개\n1. 온스타일 닥터포헤어 단독 특가\n2. 두피 각질 개선 폴리젠 샴푸",
      tiktok: "1. 아 이거 살걸…\n2. 지금이 가장 좋은 타이밍"
    }
  }
];

export default function CopywriterPage() {
  const [requestText, setRequestText] = useState('');
  const [resultText, setResultText] = useState<PlatformResult | null>(null);
const [historyList, setHistoryList] = useState<HistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('copywriter_history');
      if (savedHistory) {
        try {
          return JSON.parse(savedHistory);
        } catch (e) {
          console.error("히스토리를 불러오는데 실패했습니다.", e);
        }
      }
    }
    return initialHistory; // 저장된 게 없으면 기본 닥터포헤어 데이터 노출
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeGoogleTab, setActiveGoogleTab] = useState<'demandgen' | 'pmax' | 'aci'>('demandgen');

  const handleGenerate = async () => {
    if (!requestText.trim()) return alert('브랜드 및 상품 정보를 입력해주세요!');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productInfo: requestText }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || '엔진 API 응답 실패');
      }
      
      const data = await response.json();
      const rawText = data.result;

      // 파싱 분배
      const meta1 = rawText.split('===META1===')[1]?.split('===META2===')[0]?.trim() || '추출 실패';
      const meta2 = rawText.split('===META2===')[1]?.split('===GOOGLE_DEMANDGEN===')[0]?.trim() || '추출 실패';
      const demandgen = rawText.split('===GOOGLE_DEMANDGEN===')[1]?.split('===GOOGLE_PMAX===')[0]?.trim() || '추출 실패';
      const pmax = rawText.split('===GOOGLE_PMAX===')[1]?.split('===GOOGLE_ACI===')[0]?.trim() || '추출 실패';
      const aci = rawText.split('===GOOGLE_ACI===')[1]?.split('===TIKTOK===')[0]?.trim() || '추출 실패';
      const tiktok = rawText.split('===TIKTOK===')[1]?.trim() || '추출 실패';

      const generatedResults: PlatformResult = { meta1, meta2, demandgen, pmax, aci, tiktok };
      setResultText(generatedResults);

      const now = new Date();
      const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const newHistory: HistoryItem = {
        id: Date.now(),
        time: timeString,
        title: `캠페인 안 ${historyList.length + 1}`,
        request: requestText,
        results: generatedResults
      };

      setHistoryList([newHistory, ...historyList]);
      const updated = [newHistory, ...historyList];
      setHistoryList(updated);
      
      // 📍 이 한 줄을 바로 밑에 추가해 주세요!
      localStorage.setItem('copywriter_history', JSON.stringify(updated));

    } catch (error: any) {
      alert(`엔진 파싱 오류: ${error.message}\nAPI 라우트 파일 경로가 app/api/gemini/route.ts에 정상 위치했는지 확인해 주세요.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen m-0 p-0 bg-gray-100 text-gray-950 overflow-hidden font-sans relative">
      
      {/* 메인 작업 영역 (좌측 8/12) */}
      <div className="w-8/12 h-full flex flex-col border-r border-gray-300 bg-white">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
          <h1 className="text-xl font-extrabold text-gray-900">
            ✍️ 온스타일 멀티 매체 카피라이터 엔진
          </h1>
          <Link href="/dashboard" className="text-xs font-bold text-gray-500 border border-gray-300 rounded-lg px-3 py-1.5 bg-white">
            &larr; 대시보드 메인
          </Link>
        </div>

        {/* 텍스트 입력창 */}
        <div className="h-2/5 p-6 flex flex-col border-b border-gray-200 bg-white flex-shrink-0">
          <textarea 
            value={requestText}
            onChange={(e) => setRequestText(e.target.value)}
            disabled={isLoading}
            placeholder={"브랜드명: \n상품명 / 행사명: \n제품 특징 / 소구 포인트: \n혜택 정보: \n기간 정보: \n매체 유형: "}
            className="w-full flex-1 p-4 bg-gray-50 border border-gray-300 rounded-xl resize-none text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={handleGenerate}
            disabled={isLoading}
            className={`mt-4 w-full py-3.5 text-white font-bold rounded-xl shadow-sm transition ${isLoading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isLoading ? 'CJ온스타일 가이드라인 검증 조합 중... ⏳' : '실시간 광고 매체별 세트 추출하기 🚀'}
          </button>
        </div>

        {/* 3단 레이아웃 완전체 보드 출력부 */}
        <div className="flex-1 p-6 flex flex-col bg-gray-50/30 min-h-0 overflow-hidden">
          <h2 className="text-sm font-black text-gray-500 mb-3 flex-shrink-0">✨ 실무 배치용 매체별 최종 피드셋</h2>
          
          <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
            {/* Meta (대괄호 전면 차단) */}
            <div className="border border-blue-200 rounded-xl p-4 flex flex-col bg-white shadow-sm min-h-0">
              <div className="text-[11px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md mb-2 w-max">📱 Meta 시스템 (대괄호 미사용)</div>
              <div className="flex-1 overflow-y-auto text-xs font-semibold text-gray-800 whitespace-pre-wrap leading-relaxed pr-1 custom-scrollbar">
                {resultText ? (
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg border">{resultText.meta1}</div>
                    <div className="bg-gray-50 p-3 rounded-lg border">{resultText.meta2}</div>
                  </div>
                ) : "메타 최적화 카피 피드가 표시됩니다."}
              </div>
            </div>

            {/* Google 제품군 (DemandGen / PMAX / ACI) */}
            <div className="border border-amber-200 rounded-xl p-4 flex flex-col bg-white shadow-sm min-h-0">
              <div className="flex justify-between items-center mb-2 flex-shrink-0">
                <div className="text-[11px] font-black text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md w-max">🔍 Google 엔진 통합</div>
                <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-md text-[9px] font-bold">
                  {(['demandgen', 'pmax', 'aci'] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveGoogleTab(tab)} className={`px-1.5 py-0.5 rounded-sm capitalize ${activeGoogleTab === tab ? 'bg-white shadow-xs text-gray-900' : 'text-gray-400'}`}>{tab}</button>
                  ))}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto text-xs font-semibold text-gray-800 whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-lg border pr-1 custom-scrollbar">
                {resultText ? resultText[activeGoogleTab] : "구글 매체 규격 세트가 표시됩니다."}
              </div>
            </div>

            {/* TikTok (복원 완료) */}
            <div className="border border-red-200 rounded-xl p-4 flex flex-col bg-white shadow-sm min-h-0">
              <div className="text-[11px] font-black text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md mb-2 w-max">🎵 TikTok 숏폼 자막 (16자 내외)</div>
              <div className="flex-1 overflow-y-auto text-xs font-semibold text-gray-800 whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-lg border pr-1 custom-scrollbar">
                {resultText ? resultText.tiktok : "틱톡 숏폼 자막 카피 2안이 표시됩니다."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 우측 히스토리 영역 (우측 4/12) */}
      <div className="w-4/12 h-full flex flex-col bg-gray-50 flex-shrink-0">
        <div className="p-5 border-b border-gray-300 bg-white shadow-sm flex justify-between items-center">
          <h2 className="text-lg font-extrabold text-gray-900">📜 기획 카피 히스토리</h2>
          <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-black">{historyList.length} 건</span>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
          {historyList.map((item) => (
            <div key={item.id} onClick={() => { setResultText(item.results); setRequestText(item.request); }} className="p-4 bg-white border-2 border-gray-200 hover:border-indigo-500 rounded-xl shadow-sm cursor-pointer transition">
              <div className="w-full flex justify-between items-center mb-1">
                <span className="text-xs font-black text-gray-900">{item.title}</span>
                <span className="text-[10px] font-bold text-gray-400">{item.time}</span>
              </div>
              <p className="text-[11px] text-gray-500 truncate border-t pt-1">{item.request}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}