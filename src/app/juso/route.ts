export async function Post(req: Request) {
  const keyword = await req.json();
  console.log(keyword);

  if (!keyword || keyword.length === 0) {
    return Response.json(null, { status: 500, statusText: "No Keyword" });
  }

  const pageNo = new URL(req.url).searchParams.get("pageNo");

  if (!pageNo) {
    return Response.json(null, { status: 500, statusText: "No page start" });
  }

  const confmKey = process.env.Juso_API_KEY;

  const countPerPage = 20;

  const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?&resultType=json&confmKey=${confmKey}&currentPage${pageNo}&countPerPage=${countPerPage}&keyword=${keyword}`;

  const res = await fetch(url);
}
