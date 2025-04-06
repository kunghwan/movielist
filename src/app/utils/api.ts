// utils/api.ts
import axios from "axios";

const fetchDataFromApi = async () => {
  const API_URL = "http://apis.data.go.kr/6300000/openapi2022/midHighSchInfo";
  const API_KEY =
    "Bn899qxpRVf7ahZd8JaBjgm8EBDZ6HlIFJMWVGXpwzgtqeCU4z5tHAGB6Mf6VLHFhwukTYAIDVoFrlwAdT15Bg%3D%3D"; // 인증키
  const searchValue = "Korea"; // 검색어
  const pageValue = 1; // 페이지
  const PER_PAGE = 30; // 한 페이지에 표시할 항목 수

  try {
    const response = await axios.get(
      `${API_URL}?query=${searchValue}&serviceKey=${API_KEY}&page=${pageValue}&per_page=${PER_PAGE}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
};

export { fetchDataFromApi };
