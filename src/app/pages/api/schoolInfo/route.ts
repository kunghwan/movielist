// pages/api/schoolInfo.ts

export async function GET() {
  const serviceKey = process.env.NEXT_PUBLIC_W_SERVICE_KEY; // 환경변수에서 서비스 키를 읽어옵니다.
  const pageNo = 1; // 페이지 번호는 1로 고정

  // 실제 API URL 만들기
  const url = `http://apis.data.go.kr/6300000/openapi2022/midHighSchInfo?dataType=JSON&serviceKey=${serviceKey}&pageNo=${pageNo}`;

  console.log("URL:", url); // URL을 출력하여 서비스 키와 페이지 번호가 잘 들어갔는지 확인

  try {
    const res = await fetch(url); // fetch 호출

    // 네트워크 오류 처리
    if (!res.ok) {
      console.error("API 요청 실패:", res.statusText);
      return new Response(
        JSON.stringify({ error: "API 요청 실패: " + res.statusText }),
        { status: 500 }
      );
    }

    const data = await res.json(); // JSON 데이터로 응답을 변환

    // API 오류 처리: resultCode가 "01"이면 오류 응답
    if (data.response?.header?.resultCode === "01") {
      return new Response(
        JSON.stringify({ error: data.response.header.resultMsg }),
        { status: 500 }
      );
    }

    // 정상 응답
    return new Response(JSON.stringify(data.response), { status: 200 });
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    return new Response(
      JSON.stringify({ error: "서버 오류가 발생했습니다." }),
      { status: 500 }
    );
  }
}
