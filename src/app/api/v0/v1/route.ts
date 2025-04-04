export async function Post(req: Request) {
  const keyword = await req.json();
  console.log(keyword);

  if (!keyword || keyword.length === 0) {
    return Response.json(null, { status: 500, statusText: "No user" });
  }

  const pageNo = new URL(req.url).searchParams.get("pageNo");
}
