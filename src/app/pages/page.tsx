"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const Page = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // AllOrigins 프록시 사용
        const response = await axios.get("https://api.allorigins.win/get", {
          params: {
            url: "http://apis.data.go.kr/6300000/openapi2022/midHighSchInfo",
            serviceKey:
              "Bn899qxpRVf7ahZd8JaBjgm8EBDZ6HlIFJMWVGXpwzgtqeCU4z5tHAGB6Mf6VLHFhwukTYAIDVoFrlwAdT15Bg",
            query: "대전",
            page: 1,
            per_page: 30,
          },
        });

        // AllOrigins는 JSONP 형식으로 반환하므로, 이를 파싱합니다.
        const jsonData = JSON.parse(response.data.contents);
        setData(jsonData.response.body.items);
      } catch (err) {
        setError("API 요청 실패");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>학교 정보</h1>
      {error && <p>{error}</p>}
      {data ? (
        <ul>
          {data.map((school: any, index: number) => (
            <li key={index}>
              <h2>
                {school.schulNm} ({school.fondSe})
              </h2>
              <p>위치: {school.locplc}</p>
              <p>학급 수: {school.clasCo}</p>
              <p>학생 수: {school.stdntCo}</p>
              <p>학생/교사 비율: {school.csttCo}%</p>
              <p>학생 수 - A등급: {school.astdntCo}</p>
              <p>학생 수 - B등급: {school.bstdntCo}</p>
              <p>학생 수 - C등급: {school.cstdntCo}</p>
              <p>학생/교사 비율 - A등급: {school.acsttCo}%</p>
              <p>학생/교사 비율 - B등급: {school.bcsttCo}%</p>
              <p>학생/교사 비율 - C등급: {school.ccsttCo}%</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>로딩 중...</p>
      )}
    </div>
  );
};

export default Page;
