"use client";

import React, { useEffect, useState } from "react";

type SchoolItem = {
  signgu: string; // 자치구
  fondSe: string; // 사립/공립
  schulNm: string; // 학교명
  locplc: string; // 주소
  clasCo: string; // 학급수 합계
  nclasCo: string; // 일반 학급수
  aclasCo: string; // 1학년 학급수
  bclasCo: string; // 2학년 학급수
  cclasCo: string; // 3학년 학급수
  sclasCo: string; // 특수학년 학급수
  stdntCo: string; // 학년별 학생수
  astdntCo: string; // 1학년 학생수
  bstdntCo: string; // 2학년 학생수
  cstdntCo: string; // 3학년 학생수
  csttCo: string; // 학년별 급당인원
  acsttCo: string; // 1학년급당인원
  bcsttCo: string; // 2학년급당인원
  ccsttCo: string; // 3학년급당인원
};

type SchoolData = {
  totalCount: number;
  items: SchoolItem[];
};

const Page = () => {
  const [data, setData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"M" | "H">("H"); // 기본: 고등학교

  const fetchData = async (gu: "M" | "H") => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/schoolInfo?gu=${gu}`);
      if (!res.ok) throw new Error("API 실패");

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("❌ fetch 오류:", err);
      setError("데이터를 불러오는 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(type);
  }, [type]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>🏫 대전광역시 {type === "M" ? "중학교" : "고등학교"} 정보</h1>

      {/* ✅ 버튼 두 개 */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setType("M")} disabled={type === "M"}>
          중학교
        </button>
        <button
          onClick={() => setType("H")}
          disabled={type === "H"}
          style={{ marginLeft: "0.5rem" }}
        >
          고등학교
        </button>
      </div>

      <p>총 {data?.totalCount}개 학교</p>
      <ul>
        {data?.items.map((school, idx) => (
          <li
            key={idx}
            style={{
              marginBottom: "2rem",
              borderBottom: "1px solid #ccc",
              paddingBottom: "1rem",
            }}
          >
            <h3>
              {school.schulNm} ({school.signgu})
            </h3>
            <p>📍 주소: {school.locplc}</p>
            <p>🏫 설립구분: {school.fondSe}</p>
            <p>
              🧩 일반학급: {school.nclasCo} / 특수학급: {school.sclasCo}
            </p>
            <p>
              👨‍🎓 학년별 학급: {school.aclasCo}, {school.bclasCo},{" "}
              {school.cclasCo}
            </p>
            <p>
              👩‍🎓 학년별 학생수: {school.astdntCo}, {school.bstdntCo},{" "}
              {school.cstdntCo}
            </p>
            <p>
              📊 급당 인원: {school.acsttCo}, {school.bcsttCo}, {school.ccsttCo}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
