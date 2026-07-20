import { NextResponse } from 'next/server';
import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

// 구글 시트 인증 및 연결 함수
async function getDoc() {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
}

// 1. 저장된 히스토리 불러오기 (GET)
export async function GET() {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0]; // 첫 번째 시트 탭
    const rows = await sheet.getRows();

    const history = rows.map((row, index) => {
      const meta1 = row.get('META') || '';
      const meta2 = row.get('META2') || '';
      const google = row.get('GOOGLE') || '';
      const tiktok = row.get('TIKTOK') || '';
      const requestText = row.get('요청문구') || '';
      const timeStr = row.get('날짜') || '';

      // 요청 문구 첫 줄로 제목 생성
      const firstLine = requestText.split('\n')[0] || '';
      const displayTitle = firstLine.length > 15 ? firstLine.slice(0, 15) + '...' : firstLine || `캠페인 안 ${rows.length - index}`;

      return {
        id: index + 1,
        time: timeStr,
        title: displayTitle,
        request: requestText,
        results: {
          meta1,
          meta2,
          demandgen: google,
          pmax: google,
          aci: google,
          tiktok,
        },
      };
    }).reverse(); // 최신 생성순으로 정렬

    return NextResponse.json({ history });
  } catch (error: any) {
    console.error('구글 시트 읽기 에러:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. 새 카피 생성 결과를 구글 시트에 기록하기 (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];

    // 현재 날짜 및 시간 포맷팅
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // 설정하신 한글/대문자 헤더에 맞춰 데이터 저장
    await sheet.addRow({
      '날짜': formattedDate,
      '요청문구': body.request,
      'META': body.results.meta1,
      'META2': body.results.meta2,
      'GOOGLE': body.results.demandgen,
      'TIKTOK': body.results.tiktok,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('구글 시트 저장 에러:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}