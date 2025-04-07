// `GET` 메서드를 export하여 Next.js에서 API 라우트로 사용할 수 있게 합니다.
export async function GET() {
  // 환경 변수에서 API 키를 불러옵니다 (보안상 코드에 직접 쓰지 않고 환경 변수 사용).
  const serviceKey = process.env.NEXT_PUBLIC_W_SERVICE_KEY;

  // 요청할 페이지 번호를 설정합니다. (현재는 1페이지 고정)
  const pageNo = 1;

  // API 호출을 위한 URL을 만듭니다.
  // `${}` 문법으로 serviceKey와 pageNo를 URL에 동적으로 삽입합니다.
  const url = `http://apis.data.go.kr/6300000/openapi2022/midHighSchInfo?dataType=JSON&serviceKey=${serviceKey}&pageNo=${pageNo}`;

  // fetch 함수를 이용해 해당 URL로 HTTP 요청을 보냅니다.
  const res = await fetch(url);

  // 응답을 JSON 형태로 파싱합니다.
  const data = await res.json();

  // 오류 처리: 응답의 resultCode가 "01"이면 실패한 요청입니다.
  // 이 경우, error 메시지를 담아 500 상태 코드와 함께 반환합니다.
  if (data.response?.header?.resultCode === "01") {
    return new Response(
      JSON.stringify({ error: data.response.header.resultMsg }), // 에러 메시지를 JSON 형식으로 변환
      {
        status: 500, // 서버 오류 상태 코드
      }
    );
  }

  // 문제가 없으면, 응답 데이터 중 response 객체만 JSON으로 반환합니다.
  // 상태 코드는 200 (성공)입니다.
  return new Response(JSON.stringify(data.response), { status: 200 });
}
