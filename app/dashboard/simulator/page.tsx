import React from 'react';

export default function SimulatorPage() {
  return (
    <div className="w-screen h-screen m-0 p-0 overflow-hidden bg-white">
      <iframe 
        src="/simulator.html" // 로컬에 내장된 원본 HTML 파일 연결
        className="w-full h-full border-none m-0 p-0"
        style={{ width: '100vw', height: '100vh' }}
        title="예산 시뮬레이터"
      />
    </div>
  );
}