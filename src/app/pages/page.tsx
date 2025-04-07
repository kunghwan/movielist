// app/page.tsx
"use client";

import React, { useEffect, useState } from "react";

type SchoolData = {
  totalCount: number;
  items: Array<{ schoolName: string; address: string }>;
};

const Page = () => {
  const [data, setData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/proxy"); // 프록시 API 호출
        if (!response.ok) {
          throw new Error("데이터를 가져오는 데 실패했습니다");
        }

        const result = await response.json();
        setData(result); // API 응답 데이터를 상태에 저장
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        setError("데이터를 가져오는 중 오류가 발생했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>학교 정보</h1>
      {data ? (
        <div>
          <p>총 학교 수: {data.totalCount}</p>
          <ul>
            {data.items.map((school, index) => (
              <li key={index}>
                <strong>{school.schoolName}</strong> - {school.address}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default Page;
