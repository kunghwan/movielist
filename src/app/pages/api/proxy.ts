export async function GET() {
  const serviceKey = process.env.NEXT_PUBLIC_W_SERVICE_KEY;

  const pageNo = 1;

  const url = `http://apis.data.go.kr/6300000/openapi2022/midHighSchInfo?dataType=JSON&serviceKey=${serviceKey}&pageNo=${pageNo}`;

  const res = await fetch(url);

  const data = await res.json();

  if (data.response?.header?.responseCode === "01") {
    return new Response(JSON.stringify(data.response.header.response), {
      status: 500,
    });
  }

  return new Response(JSON.stringify(data.response), { status: 200 });
}
