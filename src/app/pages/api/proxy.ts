export async function GET() {
  const serviceKey = process.env.NEXT_PUBLIC_W_SERVICE_KEY; // 환경 변수에서 API 키를 불러옵니다.
  const pageNo = 1;

  // URL에 serviceKey와 pageNo가 제대로 들어가도록 수정
  const url = `http://apis.data.go.kr/6300000/openapi2022/midHighSchInfo?dataType=JSON&serviceKey=${serviceKey}&pageNo=${pageNo}`;

  // API 호출
  const res = await fetch(url);
  const data = await res.json();

  // 오류 처리: resultCode가 "01"이면 에러 메시지 반환
  if (data.response?.header?.resultCode === "01") {
    return new Response(
      JSON.stringify({ error: data.response.header.resultMsg }),
      {
        status: 500,
      }
    );
  }

  // 정상 응답 반환
  return new Response(JSON.stringify(data.response), { status: 200 });
}
