// pages/api/schoolInfo.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const API_URL = "http://apis.data.go.kr/6300000/openapi2022/midHighSchInfo"; // 공공데이터 API URL
  const API_KEY = process.env.NEXT_PUBLIC_JUSO_API_KEY; // .env.local에서 API 키를 가져옴

  try {
    const response = await axios.get(API_URL, {
      params: {
        serviceKey: API_KEY, // API 키
        query: "서구", // 예시: 검색할 지역명
        page: 1, // 페이지 번호
        per_page: 20, // 한 페이지에 출력할 항목 수
      },
    });

    return NextResponse.json(response.data); // API 응답을 클라이언트로 전달
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
    return NextResponse.json(
      { error: "API 요청 중 오류 발생" },
      { status: 500 }
    );
  }
}
