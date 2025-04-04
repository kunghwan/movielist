import axios from "axios";

import response from "@/app/api";

// 비동기 POST 함수 정의 (요청을 처리)
export async function POST(req: Request) {
  // 요청 본문에서 JSON을 파싱하여 'keyword' 값을 가져옴
  const { keyword } = await req.json();

  // 'keyword'가 없거나 비어있는 문자열인 경우 500 에러 응답을 반환
  if (!keyword || keyword.length === 0) {
    return response.error("키워드는 최소 2단어 이상입니다.");
    // return Response.json(null, { status: 500, statusText: "No Keyword sent" });
  }

  // URL에서 'pageNo' 쿼리 파라미터를 가져옴
  const pageNo = new URL(req.url).searchParams.get("pageNo");

  // 'pageNo'가 없으면 500 에러 응답을 반환
  if (!pageNo) {
    return Response.json(null, { status: 500, statusText: "No page Number" });
  }

  // 환경 변수에서 API 키를 가져옴
  const confmKey = process.env.JUSO_API_KEY!; // 느낌표는 해당 값이 정의되어 있다고 TypeScript에 알려줌

  // 한 페이지에 표시할 결과 수를 20으로 설정
  const countPerPage = 20;

  // API 요청 URL을 'keyword', 'pageNo' 등을 포함하여 구성
  const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?resultType=json&confmKey=${confmKey}&currentPage=${pageNo}&countPerPage=${countPerPage}&keyword=${keyword}`;

  // Juso API에 대해 fetch 요청을 보냄
  // const res = await fetch(url);

  // // fetch 요청의 응답을 JSON 형식으로 파싱
  // const data = await res.json();

  // // 응답에 오류가 있을 경우 (errorCode가 "0"이 아닌 경우) 500 에러 응답을 반환

  try {
    const { data } = await axios.get(url);

    if (data.results.common.errorCode !== "0") {
      return response.error(data.results.common.errorMessage, {
        status: 500,
        statusText: data.results.common.errorCode, // API에서 전달된 오류 메시지
      });
    }

    console.log(data);
    const payload: JusoApiResponse = {
      totalCount: Number(data.results.common.totalCount), // 전체 항목 수를 숫자로 변환
      countPerPage, // 한 페이지에 표시할 항목 수
      currentPage: Number(pageNo), // 현재 페이지 번호
      items: data.results.juso, // API에서 반환된 주소 항목들
    };
    return response.send<JusoApiResponse>({ ...payload });
  } catch (error: any) {
    return response.error(error.message);
  }

  // API 호출이 성공하면, 응답에 포함할 데이터를 생성

  // 클라이언트에게 JSON 형식으로 응답을 반환
}
interface JusoApiResponse {
  totalCount: number;
  countPerPage: number;
  currentPage: number; // 현재 페이지 번호
  items: any[]; // API에서 반환된 주소 항목들
}
