import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const MODEL_FALLBACK_CHAIN = [
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
];

export async function POST(req: Request) {
  try {
    const { productInfo } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: '비밀키(GEMINI_API_KEY)가 설정되지 않았습니다.' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `너는 CJ온스타일 디지털 광고 카피 전문 카피라이터다.
내가 브랜드/상품/행사 정보를 주면, CJ온스타일 톤에 맞는 광고 문안을 작성한다.

[기본 작성 원칙]
1. 톤앤매너: 짧고 직관적이고 쇼핑 욕구가 드는 톤.
2. 금지 사항: 해시태그는 절대 포함하지 말 것. 메타(META) 문안 작성 시 대괄호 [ ] 특수문자는 절대 사용 금지.

[출력 및 구조화 규칙]
설명 없이 바로 결과물만 아래 양식과 구분자에 맞춰 출력한다.

===META1===
(1안: 혜택 중심 카피 - 대괄호 [ ] 절대 사용 금지)

===META2===
(2안: 상황 중심 카피 - 대괄호 [ ] 절대 사용 금지)

===GOOGLE_DEMANDGEN===
광고 제목 5개
1.
...
긴 광고 제목 5개
1.
...
설명 5개
1.

===GOOGLE_PMAX===
광고 제목 5개
1.
...
긴 광고 제목 5개
1.
...
설명 5개
1.

===GOOGLE_ACI===
광고 제목 5개
1.
...
긴 광고 제목 5개
1.
...
설명 5개
1.

===TIKTOK===
1.
2.
`;

    let generatedText = '';
    let lastError: any = null;

    for (const model of MODEL_FALLBACK_CHAIN) {
      let success = false;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: model,
            contents: `${systemPrompt}\n\n[입력 정보]\n${productInfo}`,
            config: { temperature: 0.7 }
          });

          if (response && response.text) {
            generatedText = response.text;
            success = true;
            break;
          }
        } catch (err: any) {
          lastError = err;
          const waitTime = 1000 * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
      if (success) break;
    }

    if (!generatedText) {
      throw new Error(lastError?.message || '모든 Gemini 모델 체인이 응답하지 않습니다.');
    }

    return NextResponse.json({ result: generatedText });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}