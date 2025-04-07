// /app/api/schoolInfo/route.ts
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const serviceKey = process.env.NEXT_PUBLIC_W_SERVICE_KEY!;
  const pageNo = 1;
  const numOfRows = 50;

  // ✅ 쿼리 파라미터에서 gu 가져오기 (기본값 H)
  const gu = req.nextUrl.searchParams.get("gu") || "H";
  const encodedKey = encodeURIComponent(serviceKey);

  const url = `https://apis.data.go.kr/6300000/openapi2022/midHighSchInfo/getmidHighSchInfo?serviceKey=${encodedKey}&gu=${gu}&pageNo=${pageNo}&numOfRows=${numOfRows}&dataType=json`;

  console.log("✅ 호출 URL:", url);

  try {
    const res = await fetch(url);
    const json = await res.json();

    const items = json.response?.body?.items || [];
    const totalCount = json.response?.body?.totalCount || 0;

    return new Response(JSON.stringify({ totalCount, items }), { status: 200 });
  } catch (error) {
    console.error("❌ API 호출 실패:", error);
    return new Response(JSON.stringify({ error: "서버 오류 발생" }), {
      status: 500,
    });
  }
}
