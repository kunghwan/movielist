export async function Post(req: Request) {
  const keyword = await req.json();

  if (!keyword || keyword.length === 0) {
    return Response.json(null, { status: 500, statusText: "No keyword" });
  }

  const pageNo = new URL(req.url).searchParams.get("pageNo");

  if (!pageNo) {
    return Response.json(null, { status: 500, statusText: "No page" });
  }

  const confmKey = process.env.JUSO_API_KEY;
  const countPerPage = 20;

  const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?&resultType=json&comfmKey=${confmKey}&countPerPage=${countPerPage}&currentPage=${pageNo}&keyword=${keyword}`;

  const res = await fetch(url);

  const data = await res.json();

  if (data.results.common.errorCode !== "0") {
    return Response.json(null, {
      status: 500,
      statusText: data.results.common.errorMessage,
    });
  }

  const payload = {
    totalCount: Number(data.results.common.totalCount),
    countPerPage,
    currentPage: pageNo,
    items: data.results.myjuso,
  };

  return Response.json(payload);
}
