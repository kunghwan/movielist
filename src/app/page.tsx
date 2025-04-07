"use client";

import React, { useEffect, useState } from "react";

type SchoolItem = {
  signgu?: string;
  fondSe: string;
  schulNm: string;
  locplc: string;
  clasCo: string;
  nclasCo: string;
  aclasCo: string;
  bclasCo: string;
  cclasCo: string;
  sclasCo: string;
  stdntCo: string;
  astdntCo: string;
  bstdntCo: string;
  cstdntCo: string;
  csttCo: string;
  acsttCo: string;
  bcsttCo: string;
  ccsttCo: string;
};

type SchoolData = {
  totalCount: number;
  items: SchoolItem[];
};

// ✅ 자치구 목록 (기타 포함)
const ALL_GUS = ["동구", "중구", "서구", "유성", "대덕", "기타"];

const Page = () => {
  const [data, setData] = useState<SchoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"M" | "H">("H");
  const [filter, setFilter] = useState<"전체" | "공립" | "사립">("전체");
  const [selectedGus, setSelectedGus] = useState<string[]>([...ALL_GUS]);

  // ✅ 자치구 분류 (null 방지 포함)
  const getGuCategory = (signgu?: string): string => {
    if (!signgu || typeof signgu !== "string") return "기타";
    if (signgu.includes("동구")) return "동구";
    if (signgu.includes("중구")) return "중구";
    if (signgu.includes("서구")) return "서구";
    if (signgu.includes("유성")) return "유성";
    if (signgu.includes("대덕")) return "대덕";
    return "기타";
  };

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
    setFilter("전체");
    setSelectedGus([...ALL_GUS]);
  }, [type]);

  const handleGuChange = (gu: string) => {
    if (selectedGus.includes(gu)) {
      setSelectedGus(selectedGus.filter((g) => g !== gu));
    } else {
      setSelectedGus([...selectedGus, gu]);
    }
  };

  const filteredItems = data?.items
    ?.filter((school) => selectedGus.includes(getGuCategory(school.signgu)))
    ?.filter((school) => filter === "전체" || school.fondSe === filter);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>🏫 대전광역시 {type === "M" ? "중학교" : "고등학교"} 정보</h1>

      {/* ✅ 중/고등학교 버튼 */}
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

      {/* ✅ 공립/사립 필터 */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          <input
            type="radio"
            name="schoolType"
            value="전체"
            checked={filter === "전체"}
            onChange={() => setFilter("전체")}
          />
          전체
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            name="schoolType"
            value="공립"
            checked={filter === "공립"}
            onChange={() => setFilter("공립")}
          />
          공립
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            name="schoolType"
            value="사립"
            checked={filter === "사립"}
            onChange={() => setFilter("사립")}
          />
          사립
        </label>
      </div>

      {/* ✅ 자치구 필터 */}
      <div style={{ marginBottom: "1rem" }}>
        <strong>자치구:</strong>
        {ALL_GUS.map((gu) => (
          <label key={gu} style={{ marginLeft: "1rem" }}>
            <input
              type="checkbox"
              value={gu}
              checked={selectedGus.includes(gu)}
              onChange={() => handleGuChange(gu)}
            />
            {gu}
          </label>
        ))}
      </div>

      {/* ✅ 데이터 출력 */}
      <div className="p-4 bg-sky-300 rounded-2xl">
        <p>총 {filteredItems?.length ?? 0}개 학교</p>
        <ul>
          {filteredItems?.map((school, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: "2rem",
                borderBottom: "1px solid #ccc",
                paddingBottom: "1rem",
              }}
            >
              <h3>
                {school.schulNm} ({school.signgu ?? "자치구 없음"})
              </h3>
              <p>📍 주소: {school.locplc}</p>
              <p>🏫 설립구분: {school.fondSe}</p>
              <p>
                🧩 일반학급: {school.nclasCo} / 특수학급: {school.sclasCo}
              </p>
              <p>
                👨‍🎓 학년별 학급: 1학년 {school.aclasCo}개, 2학년 {school.bclasCo}
                개, 3학년 {school.cclasCo}개
              </p>
              <p>
                👩‍🎓 학년별 학생수: {school.astdntCo}, {school.bstdntCo},{" "}
                {school.cstdntCo}
              </p>
              <p>
                📊 급당 인원: {school.acsttCo}, {school.bcsttCo},{" "}
                {school.ccsttCo}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
