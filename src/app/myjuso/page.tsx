"use client";
import { useTransition, useState, useEffect, useRef, useCallback } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import RootLoading from "../loading";
import {
  IoChevronBack,
  IoChevronDown,
  IoChevronForward,
  IoChevronUp,
} from "react-icons/io5";
import axios from "axios";

interface JusoProps {
  bdMgtSn: string; //! unique id
  roadAddr: string;
  siNm: string;
  sggNm: string;
  rn: string;
  zipNo: string;
}

const Juso = () => {
  // 상태 관리
  const [keyword, setKeyword] = useState(""); // 검색어
  const [isShowing, setIsShowing] = useState(false); // 주소 리스트 펼치기/접기 상태
  const [juso, setJuso] = useState<JusoProps | null>(null); // 선택된 주소
  const [rest, setRest] = useState(""); // 나머지 주소 입력
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalCount, setTotalCount] = useState(0); // 전체 항목 수
  const [items, setItems] = useState<JusoProps[]>([]); // 주소 목록
  const keywordRef = useRef<HTMLInputElement>(null); // 검색어 입력 ref
  const restRef = useRef<HTMLInputElement>(null); // 나머지 주소 입력 ref
  const [isPending, startTransition] = useTransition(); // 비동기 상태 관리

  // 주소 검색 처리 함수
  const onSubmit = useCallback(
    (pageNo: number) => {
      if (keyword.length === 0) {
        alert("검색어를 입력해주세요.");
        return keywordRef.current?.focus(); // 입력창에 포커스
      }
      startTransition(async () => {
        const url = `/api/v1/test/juso?pageNo=${pageNo}`;
        try {
          const { data } = await axios.post(url, { keyword });
          setItems(data.items); // 검색 결과를 items 상태에 저장
          setTotalCount(data.totalCount); // 전체 항목 수를 totalCount에 저장
        } catch (error: any) {
          console.log(error);
          alert(error.response.data); // 에러 처리
        }
      });
    },
    [keyword]
  );

  // 주소 저장 처리 함수
  const onSaveJuso = useCallback(() => {
    if (!juso) {
      if (items.length === 0) {
        alert("주소를 검색해주세요.");
        setKeyword("");
        setIsShowing(false);
        return keywordRef.current?.focus();
      }
      alert("주소를 선택해주세요.");
      return setIsShowing(true);
    }
    if (rest.length === 0) {
      alert("나머지 주소를 입력해주세요.");
      return restRef.current?.focus();
    }

    if (
      confirm(
        `입력하신 주소가 ${juso.roadAddr}, ${rest}, 우편번호 ${juso.zipNo}가 맞으신가요?`
      )
    ) {
      return alert("주소를 저장하였습니다.");
    }
    restRef.current?.focus();
  }, [rest, juso, items]);

  return (
    <div className="mt-5 max-w-100 mx-auto">
      {isPending && <RootLoading />} {/* 로딩 상태일 때 로딩 컴포넌트 표시 */}
      <form
        onSubmit={(e) => {
          e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
          onSubmit(currentPage); // 현재 페이지로 주소 검색
        }}
        className=" "
      >
        <div className="flex gap-x-2.5 mx-auto">
          <input
            type="text"
            className="border p-2.5 rounded bg-gray-100 border-gray-200 w-200"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)} // 검색어 변경 시 상태 업데이트
            placeholder="대전 동구"
            ref={keywordRef}
            id="keyword"
          />
          <button className="border p-3 rounded bg-amber-400 text-white text-2xl">
            <AiOutlineSearch />
          </button>
        </div>
      </form>
      {/* 검색된 주소 목록이 있을 때만 펼치기/접기 버튼 표시 */}
      {items.length > 0 && (
        <button onClick={() => setIsShowing((prev) => !prev)} className="mt-4">
          {!isShowing ? <>펼치기</> : <>접기</>}
        </button>
      )}
      {/* 주소 목록 */}
      {isShowing && items.length > 0 ? (
        <div>
          <ul>
            {items.map((item) => {
              const selected = item.bdMgtSn === juso?.bdMgtSn; // 선택된 주소 여부 확인
              return (
                <li
                  key={item.bdMgtSn}
                  onClick={() => {
                    setJuso(item); // 주소 선택 시 juso 상태 업데이트
                    setIsShowing(false); // 목록 접기
                    setTimeout(() => restRef.current?.focus(), 100); // 나머지 주소 입력으로 포커스 이동
                  }}
                  className={`cursor-pointer p-2.5 rounded hover:bg-gray-200 ${
                    selected ? "bg-sky-500 text-white" : ""
                  }`}
                >
                  {item.roadAddr}
                </li>
              );
            })}
          </ul>

          <ul></ul>
        </div>
      ) : (
        <div>
          <label htmlFor="keyword">검색된 주소가 없습니다.</label>{" "}
          {/* 검색된 주소가 없을 경우 안내 */}
        </div>
      )}
    </div>
  );
};

export default Juso;
