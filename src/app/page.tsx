"use client";

import React, { useEffect, useState } from "react";

type SchoolItem = {
  schoolNm: string;
  adres: string;
  type: string;
  lctn: string;
};

type SchoolData = {
  totalCount: number;
  items: SchoolItem[];
};

const Page = () => {
  const [data, setData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/schoolInfo");
        if (!res.ok) throw new Error("API 실패");

        const json = await res.json();
        setData(json); // ✅ 여기가 핵심!
      } catch (err) {
        console.error("❌ fetch 오류:", err);
        setError("데이터를 불러오는 중 오류 발생");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>📘 대전광역시 중·고등학교 정보</h1>
      <p>총 {data?.totalCount}개 학교</p>
      <ul>
        {data?.items.map((school, idx) => (
          <li key={idx} style={{ marginBottom: "1rem" }}>
            <strong>{school.schoolNm}</strong>
            <br />
            📍 {school.adres}
            <br />
            🏫 {school.type} / {school.lctn}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
