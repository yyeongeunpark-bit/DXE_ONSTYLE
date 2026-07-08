'use client';
import { useState } from 'react';

export default function Home() {
  const [productInfo, setProductInfo] = useState('');
  const [platform, setPlatform] = useState('google');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!productInfo.trim()) {
      alert('제품 정보를 입력해주세요!');
      return;
    }

    setLoading(true);
    setResult('');

    try {
      // 우리가 만든 백엔드 주소(/api/generate)로 입력을 보냅니다.
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, productInfo }),
      });
      const data = await res.json();
      setResult(data.result || data.error);
    } catch (err) {
      setResult('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>🎯 매체별 광고 카피 생성기</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>1. 광고 매체 선택</label>
        <select 
          value={platform} 
          onChange={(e) => setPlatform(e.target.value)}
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px' }}
        >
          <option value="google">구글 검색 광고 (제목 30자 / 설명 90자)</option>
          <option value="tiktok">틱톡 광고 (트렌디한 느낌 / 100자 이내)</option>
          <option value="meta">메타 광고 (기본 125자 / 제목 40자)</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>2. 제품 또는 서비스 정보 입력</label>
        <textarea 
          rows={5} 
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '6px', boxSizing: 'border-box' }}
          placeholder="예시) 2030 직장인을 위한 목 디스크 방지 거북목 베개. 현재 런칭 기념 30% 특가 할인 중 및 무료 배송"
          value={productInfo}
          onChange={(e) => setProductInfo(e.target.value)}
        />
      </div>

      <button 
        onClick={handleGenerate} 
        disabled={loading} 
        style={{ 
          width: '100%', padding: '15px', fontSize: '16px', fontWeight: 'bold',
          backgroundColor: loading ? '#ccc' : '#0070f3', color: 'white', 
          border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer' 
        }}
      >
        {loading ? 'AI가 카피를 짜는 중입니다...' : '광고 문안 완성하기 ✨'}
      </button>

      {result && (
        <div style={{ marginTop: '30px', padding: '20px', background: '#f0f2f5', borderRadius: '8px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          <h3 style={{ marginTop: 0 }}>🎁 추천 광고 문안:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}