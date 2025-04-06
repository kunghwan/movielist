// src/app/api/proxy/route.ts (or pages/api/proxy.ts if using the older pages structure)

import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const API_URL = "http://apis.data.go.kr/6300000/openapi2022/midHighSchInfo";
  const API_KEY =
    "Bn899qxpRVf7ahZd8JaBjgm8EBDZ6HlIFJMWVGXpwzgtqeCU4z5tHAGB6Mf6VLHFhwukTYAIDVoFrlwAdT15Bg%3D%3D";

  try {
    const response = await axios.get(API_URL, {
      params: {
        serviceKey: API_KEY,
        query: "서구",
        page: 1,
        per_page: 20,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.error();
  }
}
