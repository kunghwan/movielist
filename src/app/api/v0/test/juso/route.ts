// POST 메서드로 API 요청을 처리하는 함수
export async function POST(req: Request) {
  // 클라이언트에서 전송한 JSON 데이터를 읽어옵니다.
  const keyword = await req.json();
  console.log(keyword, 9); // 키워드가 제대로 전달되었는지 콘솔로 출력

  // 만약 키워드가 없거나 빈 문자열인 경우, 500 상태 코드와 함께 오류 메시지를 반환합니다.
  if (!keyword || keyword.length === 0) {
    return Response.json(null, { status: 500, statusText: "No Keyword sent" });
  }

  // URL에서 페이지 번호를 추출합니다.
  const pageNo = new URL(req.url).searchParams.get("pageNo");

  // 페이지 번호가 전달되지 않으면 500 상태 코드와 함께 오류 메시지를 반환합니다.
  if (!pageNo) {
    return Response.json(null, { status: 500, statusText: "No page start" });
  }

  // 환경 변수에서 주소 API 키를 가져옵니다.
  const confmKey = process.env.JUSO_API_KEY;

  // 한 페이지에 표시할 항목 수
  const countPerPage = 20;

  // 주소 API의 URL을 설정합니다. 이 URL은 주소 검색을 위한 API 호출을 위해 필요합니다.
  const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?resultType=json&confmKey=${confmKey}&currentPage=${pageNo}&countPerPage=${countPerPage}&keyword=${keyword}`;

  // 위 URL로 fetch 요청을 보내어 결과를 받아옵니다.
  const res = await fetch(url);
  console.log(res, 14); // 응답이 제대로 왔는지 확인하기 위해 콘솔 출력

  // 응답 데이터를 JSON 형식으로 변환합니다.
  const data = await res.json();
  console.log(data, 16); // 응답 데이터가 제대로 받아졌는지 확인하기 위해 콘솔 출력

  // 만약 API 호출 결과에 오류 코드가 있으면, 오류 메시지를 반환합니다.
  if (data.results.common.errorCode !== "0") {
    return Response.json(null, {
      status: 500,
      statusText: data.results.common.errorMessage,
    });
  }

  // 성공적인 응답이 왔을 경우, 필요한 데이터를 payload 형태로 만들어 반환합니다.
  const payload = {
    totalCount: Number(data.results.common.totalCount), // 전체 검색 결과 수
    countPerPage, // 한 페이지당 항목 수
    currentPage: pageNo, // 현재 페이지 번호
    items: data.results.juso, // 검색된 주소 목록
  };

  // 결과를 클라이언트에 JSON 형식으로 반환합니다.
  return Response.json(payload);
}
