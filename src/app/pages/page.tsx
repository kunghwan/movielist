"use client"; // ✅ 이 컴포넌트는 클라이언트에서 실행됨을 명시 (Next.js 13 이상에서 사용)

// React 훅 임포트
import React, { useEffect, useState } from "react";

// ✅ 학교 항목 타입 정의
type SchoolItem = {
  signgu?: string; // 자치구
  fondSe: string; // 설립 구분 (공립/사립)
  schulNm: string; // 학교 이름
  locplc: string; // 위치 (주소)
  clasCo: string; // 전체 학급 수
  nclasCo: string; // 일반 학급 수
  aclasCo: string; // 1학년 학급 수
  bclasCo: string; // 2학년 학급 수
  cclasCo: string; // 3학년 학급 수
  sclasCo: string; // 특수 학급 수
  stdntCo: string; // 전체 학생 수
  astdntCo: string; // 1학년 학생 수
  bstdntCo: string; // 2학년 학생 수
  cstdntCo: string; // 3학년 학생 수
  csttCo: string; // 급당 학생 수 전체
  acsttCo: string; // 1학년 급당 인원
  bcsttCo: string; // 2학년 급당 인원
  ccsttCo: string; // 3학년 급당 인원
};

// ✅ 전체 데이터 타입
type SchoolData = {
  totalCount: number; // 전체 개수
  items: SchoolItem[]; // 학교 리스트
};

// ✅ 사용할 자치구 목록 정의
const ALL_GUS = ["동구", "중구", "서구", "유성", "대덕", "기타"];

const Page = () => {
  // ✅ 상태값 정의
  const [data, setData] = useState<SchoolItem[]>([]); // 원본 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태
  const [type, setType] = useState<"M" | "H">("H"); // M = 중학교, H = 고등학교
  const [filter, setFilter] = useState<"전체" | "공립" | "사립">("전체"); // 설립 구분 필터
  const [selectedGus, setSelectedGus] = useState<string[]>([...ALL_GUS]); // 선택된 자치구들

  // ✅ 자치구를 구분해주는 함수
  const getGuCategory = (signgu?: string): string => {
    if (!signgu || typeof signgu !== "string") return "기타";
    if (signgu.includes("동구")) return "동구";
    if (signgu.includes("중구")) return "중구";
    if (signgu.includes("서구")) return "서구";
    if (signgu.includes("유성")) return "유성";
    if (signgu.includes("대덕")) return "대덕";
    return "기타";
  };

  // ✅ 자치구별 학교 수 계산
  const getGuCounts = (items: SchoolItem[]) => {
    const counts: Record<string, number> = {};
    ALL_GUS.forEach((gu) => (counts[gu] = 0)); // 초기값 0
    for (const item of items) {
      const gu = getGuCategory(item.signgu);
      counts[gu]++;
    }
    return counts;
  };

  // ✅ 데이터 불러오기 함수 (중/고 선택 시 호출)
  const fetchData = async (gu: "M" | "H") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/schoolInfo?gu=${gu}`); // API 호출
      if (!res.ok) throw new Error("API 실패");

      const json = await res.json();
      setData(json.items ?? []); // items가 없으면 빈 배열
    } catch (err) {
      console.error("❌ fetch 오류:", err);
      setError("데이터를 불러오는 중 오류 발생");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // ✅ type이 바뀌면 새로 데이터를 불러오고 필터 초기화
  useEffect(() => {
    fetchData(type);
    setFilter("전체");
    setSelectedGus([...ALL_GUS]);
  }, [type]);

  // ✅ 자치구 선택/해제 핸들러
  const handleGuChange = (gu: string) => {
    if (selectedGus.includes(gu)) {
      // 이미 선택되어 있다면 제외
      setSelectedGus(selectedGus.filter((g) => g !== gu));
    } else {
      // 새로 선택
      setSelectedGus([...selectedGus, gu]);
    }
  };

  // ✅ 선택된 자치구 + 설립구분에 따라 필터링
  const filteredItems = data
    .filter((school) => selectedGus.includes(getGuCategory(school.signgu)))
    .filter((school) => filter === "전체" || school.fondSe === filter);

  // ✅ 자치구별 총합 계산
  const guCounts = getGuCounts(data);

  // ✅ 로딩 중 표시
  if (loading) return <div>로딩 중...</div>;

  // ✅ 에러 발생 시 표시
  if (error) return <div>{error}</div>;

  // ✅ 화면 출력
  return (
    <div style={{ padding: "1rem" }}>
      <h1>🏫 대전광역시 {type === "M" ? "중학교" : "고등학교"} 정보</h1>

      {/* ✅ 중학교 / 고등학교 버튼 */}
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

      {/* ✅ 공립 / 사립 필터 */}
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

      {/* ✅ 자치구 체크박스 필터 */}
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
            {gu} ({guCounts[gu]})
          </label>
        ))}
      </div>

      {/* ✅ 결과 리스트 출력 */}
      <div className="p-4 bg-sky-300 rounded-2xl">
        <p>총 {filteredItems.length}개 학교</p>
        <ul>
          {filteredItems.map((school, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: "2rem",
                borderBottom: "1px solid #ccc",
                paddingBottom: "1rem",
              }}
            >
              <h3>
                {school.schulNm} ({school.signgu || "자치구 없음"})
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
