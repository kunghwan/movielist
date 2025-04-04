"use client"; // 클라이언트에서만 실행될 수 있음을 지정하는 지시어(Next.js에서 사용)

import { useTransition, useState, useEffect, useRef, useCallback } from "react"; // 필요한 리액트 훅들
import { AiOutlineSearch } from "react-icons/ai"; // 검색 아이콘을 사용
import { twMerge } from "tailwind-merge"; // tailwind CSS 클래스를 병합하는 유틸리티
import RootLoading from "../loading"; // 로딩 컴포넌트
import {
  IoChevronBack,
  IoChevronDown,
  IoChevronForward,
  IoChevronUp,
} from "react-icons/io5"; // 페이지네이션 아이콘들
import axios from "axios"; // HTTP 요청을 보내기 위한 axios 라이브러리

interface JusoProps {
  bdMgtSn: string; //! 고유 ID
  roadAddr: string; // 도로명 주소
  siNm: string; // 시 이름
  sggNm: string; // 구 이름
  rn: string; // 도로명
  zipNo: string; // 우편번호
}

const Juso = () => {
  const [keyword, setKeyword] = useState(""); // 검색어 상태
  const [isShowing, setIsShowing] = useState(false); // 검색 결과 목록의 표시 여부

  const [juso, setJuso] = useState<JusoProps | null>(null); // 선택된 주소 상태
  const [rest, setRest] = useState(""); // 나머지 주소 입력 상태

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [totalCount, setTotalCount] = useState(0); // 전체 검색 결과 개수
  const [items, setItems] = useState<JusoProps[]>([]); // 검색된 주소 목록

  const keywordRef = useRef<HTMLInputElement>(null); // 검색어 입력 필드 참조
  const restRef = useRef<HTMLInputElement>(null); // 나머지 주소 입력 필드 참조

  const [isPending, startTransition] = useTransition(); // 비동기 상태 처리

  // 검색어로 주소를 검색하고 페이지를 요청하는 함수
  const onSubmit = useCallback(
    (pageNo: number) => {
      if (keyword.length === 0) {
        alert("검색어를 입력해주세요.");
        return keywordRef.current?.focus();
      }
      startTransition(async () => {
        const url = `/api/v0/test/juso?pageNo=${pageNo}`;
        try {
          const { data } = await axios.post(url, { keyword: "" });
          console.log(data);
        } catch (error: any) {
          console.log(error);
          alert(error.response.data);
        }
      });
    },
    [keyword, juso]
  );

  // 선택된 주소와 나머지 주소를 저장하는 함수
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
      {/* 비동기 작업 중일 때 로딩 표시 */}
      {isPending && <RootLoading />}

      {/* 검색 폼 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(currentPage);
        }}
        className="max-w-100 mx-auto"
      >
        <div className="flex gap-x-2.5">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)} // 검색어 입력 시 상태 업데이트
            placeholder="대전 중구 중앙로 121"
            ref={keywordRef}
            className={input}
            id="keyword"
          />
          <button className={twMerge(btn, "text-2xl")}>
            <AiOutlineSearch /> {/* 검색 아이콘 */}
          </button>
        </div>
      </form>

      {/* 검색 결과가 있을 경우 "펼치기/접기" 버튼 표시 */}
      {items.length > 0 && (
        <button
          onClick={() => setIsShowing((prev) => !prev)} // 클릭 시, 결과를 펼치거나 접기
          className={twMerge(
            btn,
            "px-2.5 size-auto gap-x-2.5 py-1 mt-5 mb-2.5"
          )}
        >
          {!isShowing ? (
            <>
              펼치기
              <IoChevronDown /> {/* 펼치기 아이콘 */}
            </>
          ) : (
            <>
              접기
              <IoChevronUp /> {/* 접기 아이콘 */}
            </>
          )}
        </button>
      )}

      {/* 검색 결과 목록 */}
      {isShowing &&
        (items.length > 0 ? (
          <div>
            <ul className="flex flex-col gap-y-2.5">
              {items.map((item) => {
                const selected = item.bdMgtSn === juso?.bdMgtSn; // 선택된 주소 확인
                return (
                  <li key={item.bdMgtSn} className="flex">
                    <button
                      className={twMerge(
                        "bg-gray-50 p-2.5 cursor-pointer rounded hover:bg-gray-100",
                        selected && "bg-sky-500 text-white hover:bg-sky-400"
                      )}
                      onClick={() => {
                        setJuso(item); // 선택된 주소 설정
                        setIsShowing(false); // 목록 접기
                        setTimeout(() => restRef.current?.focus(), 100); // 나머지 주소 입력 필드 포커스
                      }}
                    >
                      {item.roadAddr} {/* 주소 출력 */}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* 페이지네이션 버튼 */}
            <ul className="flex flex-wrap gap-2.5 my-2.5 justify-center">
              {1 !== currentPage && (
                <li>
                  <button
                    className={twMerge(btn, "size-8")}
                    onClick={() => {
                      let copy = currentPage;
                      if (copy > 0) {
                        copy--; // 이전 페이지로 이동
                      }
                      onSubmit(copy);
                      setCurrentPage(copy);
                    }}
                  >
                    <IoChevronBack /> {/* 이전 페이지 아이콘 */}
                  </button>
                </li>
              )}

              {/* 페이지 번호 버튼 */}
              {Array.from({ length: Math.ceil(totalCount / 20) }).map(
                (_, index) => {
                  const selected = currentPage === index + 1; // 현재 페이지 선택 여부 확인
                  const li = (
                    <li key={index}>
                      <button
                        className={twMerge(
                          btn,
                          "size-8 bg-gray-50 hover:bg-gray-100 text-black",
                          selected && "bg-sky-500 text-white hover:bg-sky-400"
                        )}
                        onClick={() => {
                          setCurrentPage(index + 1);
                          onSubmit(index + 1);
                        }}
                      >
                        {index + 1} {/* 페이지 번호 표시 */}
                      </button>
                    </li>
                  );

                  const totalLength = Math.ceil(totalCount / 20);
                  const length = 5; // 페이지 번호 표시 범위
                  const arr = Array.from({ length });

                  const items: number[] = [];
                  arr.map((_, i) => {
                    let res = -1;
                    if (i === 2) {
                      res = -1; // 중앙 페이지로 설정
                    } else {
                      res = currentPage + i - 2;
                    }
                    if (res >= 0 && res <= totalLength) {
                      items.push(res); // 가능한 페이지 번호를 배열에 추가
                    }
                  });

                  if (
                    index === 0 ||
                    index + 1 === totalLength ||
                    index + 1 === currentPage ||
                    items.find((item) => item === index + 1)
                  ) {
                    return li; // 현재 페이지나 인근 페이지는 표시
                  }

                  return null; // 그렇지 않으면 표시하지 않음
                }
              )}

              {Math.ceil(totalCount / 20) !== currentPage && (
                <li>
                  <button
                    className={twMerge(btn, "size-8")}
                    onClick={() => {
                      let copy = currentPage;
                      if (copy < Math.ceil(totalCount / 20)) {
                        copy++; // 다음 페이지로 이동
                      }

                      onSubmit(copy);
                      setCurrentPage(copy);
                    }}
                  >
                    <IoChevronForward /> {/* 다음 페이지 아이콘 */}
                  </button>
                </li>
              )}
            </ul>
          </div>
        ) : (
          <label htmlFor="keyword">
            해당 검색어로 조회된 주소가 존재하지 않습니다.
          </label>
        ))}

      {/* 선택된 주소와 나머지 주소 입력 폼 */}
      {juso && (
        <form
          className="flex flex-col gap-y-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            onSaveJuso();
          }}
        >
          <div className="flex gap-x-2.5">
            <label
              htmlFor="keyword"
              className={twMerge(input, "flex items-center flex-1")}
            >
              {juso.roadAddr} {/* 도로명 주소 */}
            </label>
            <label
              htmlFor="keyword"
              className={twMerge(input, "flex items-center w-auto")}
            >
              {juso.zipNo} {/* 우편번호 */}
            </label>
          </div>
          <div className="flex gap-x-2.5">
            <input
              value={rest}
              onChange={(e) => setRest(e.target.value)} // 나머지 주소 상태 업데이트
              placeholder="나머지 주소"
              className={twMerge(input, "flex-1")}
              ref={restRef}
            />
            <button className={btn}>저장</button> {/* 저장 버튼 */}
          </div>
        </form>
      )}
    </div>
  );
};

export default Juso;

const input =
  "border border-gray-200 bg-gray-50 outline-none focus:border-sky-500 h-12 rounded focus:bg-transparent px-2.5 w-full";

const btn =
  "rounded cursor-pointer bg-sky-500 text-white flex justify-center items-center size-12";
