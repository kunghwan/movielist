"use client";

import { useTransition, useState, useRef, useCallback } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { twMerge } from "tailwind-merge";
import RootLoading from "../loading";
import {
  IoChevronBack,
  IoChevronDown,
  IoChevronForward,
  IoChevronUp,
} from "react-icons/io5";

interface JusoProps {
  bdMgtSn: string; // unique id
  roadAddr: string;
  siNm: string;
  sggName: string;
  rn: string;
  zipNo: string;
}

const Juso = () => {
  const [keyword, setKeyword] = useState(""); // 검색어
  const [isShowing, setIsShowing] = useState(false); // 검색 결과 펼치기/접기
  const [items, setItems] = useState<JusoProps[]>([]); // 검색 결과 아이템들
  const [totalCount, setTotalCount] = useState(0); // 전체 결과 수
  const [isPending, startTransition] = useTransition(); // 데이터 로딩 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지

  const [selectedJuso, setSelectedJuso] = useState<JusoProps | null>(null); // 선택된 주소
  const [rest, setRest] = useState(""); // 나머지 주소
  const keywordRef = useRef<HTMLInputElement>(null);

  const onSubmit = useCallback(
    (pageNo: number) => {
      if (keyword.length === 0) {
        alert("검색어를 입력해 주세요.");
        return keywordRef.current?.focus();
      }
      startTransition(async () => {
        const res = await fetch(`/api/v0/test/juso?pageNo=${pageNo}`, {
          method: "POST",
          body: JSON.stringify(keyword),
        });

        try {
          const data = await res.json();
          console.log(data);
          setIsShowing(true); // 데이터를 불러온 후 펼치기 버튼을 보이게 합니다.
          setTotalCount(data.totalCount ?? 0);
          setItems(data.items ?? []);
        } catch (error: any) {
          console.error("Error fetching or parsing data:", error);
          alert(error.message);
        }
      });
    },
    [keyword]
  );

  const getPaginationRange = () => {
    const totalPages = Math.ceil(totalCount / 20);
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(currentPage + 2, totalPages);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // 페이지를 한 칸 뒤로
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // currentPage가 1 미만으로 내려가지 않도록 제한
  };

  // 페이지를 한 칸 앞으로
  const handleNextPage = () => {
    const totalPages = Math.ceil(totalCount / 20);
    setCurrentPage(
      (prevPage) => Math.min(prevPage + 1, totalPages) // currentPage가 totalPages를 넘지 않도록 제한
    );
  };

  // 주소 저장 함수
  const onSaveJuso = useCallback(() => {
    if (!selectedJuso) {
      alert("주소를 선택해주세요.");
      return;
    }
    if (rest.length === 0) {
      alert("나머지 주소를 입력해주세요.");
      return;
    }

    if (
      confirm(
        `입력하신 주소가 ${selectedJuso.roadAddr}, ${rest}, 우편번호 ${selectedJuso.zipNo}가 맞으신가요?`
      )
    ) {
      alert("주소를 저장하였습니다.");
      // 여기에서 저장 API 호출 등의 작업을 할 수 있습니다.
    }
  }, [selectedJuso, rest]);

  return (
    <div className="mt-5 max-w-75 mx-auto">
      {isPending && <RootLoading />}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(currentPage);
        }}
        className="max-w-75 mx-auto"
      >
        <div className="flex gap-x-2.5 gap-2.5 mt-2.5 mx-auto mx-w-75">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="대전 중구 중앙로 121"
            ref={keywordRef}
            className={input}
            id="keyword"
          />
          <button className={twMerge(btn, "text-2xl")}>
            <AiOutlineSearch />
          </button>
        </div>
      </form>

      {isShowing && (
        <div>
          {/* 펼치기/접기 버튼 */}
          {items.length > 0 && (
            <button
              onClick={() => setIsShowing((prev) => !prev)}
              className="my-3 text-sm font-medium text-sky-500 flex items-center"
            >
              {isShowing ? (
                <>
                  접기 <IoChevronUp className="ml-1 cursor-pointer" />
                </>
              ) : (
                <>
                  펼치기 <IoChevronDown className="ml-1" />
                </>
              )}
            </button>
          )}

          {/* 검색 결과 리스트 */}
          {isShowing && items.length > 0 && (
            <ul>
              {items.map((item) => {
                const selected = item.bdMgtSn === selectedJuso?.bdMgtSn;
                return (
                  <li key={item.bdMgtSn} className="flex">
                    <button
                      className={`bg-gray-300 p-2.5 cursor-pointer rounded hover:bg-gray-100 ${
                        selected ? "bg-sky-200" : ""
                      }`}
                      onClick={() => setSelectedJuso(item)} // Set the selected address
                    >
                      {item.roadAddr}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* 페이지네이션 */}
          <ul className="flex gap-2.5 items-center">
            <button
              onClick={handlePrevPage}
              className="p-2.5 cursor-pointer bg-gray-50 hover:bg-gray-100 text-black rounded"
            >
              <IoChevronBack />
            </button>

            {getPaginationRange().map((page) => (
              <li key={page}>
                <button
                  className={twMerge(
                    btn,
                    "size-8 bg-gray-50 hover:bg-gray-100 text-black"
                  )}
                  onClick={() => {
                    setCurrentPage(page);
                    onSubmit(page);
                  }}
                >
                  {page}
                </button>
              </li>
            ))}

            <button
              onClick={handleNextPage}
              className="p-2.5 cursor-pointer bg-gray-50 hover:bg-gray-100 text-black rounded"
            >
              <IoChevronForward />
            </button>
          </ul>

          {/* 검색 결과가 없을 때 */}
          {items.length === 0 && (
            <label htmlFor="keyword" className="text-sm text-gray-500">
              해당 검색어로 조회된 주소가 존재하지 않습니다.
            </label>
          )}
        </div>
      )}

      {/* 선택된 주소와 나머지 주소 입력 폼 */}
      {selectedJuso && (
        <form
          className="flex flex-col gap-y-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            onSaveJuso();
          }}
        >
          <div>
            <label htmlFor="keyword">{selectedJuso.roadAddr}</label>
            <label htmlFor="zipNo">{selectedJuso.zipNo}</label>
          </div>
          <div className="flex gap-x-2.5">
            <input
              type="text"
              value={rest}
              onChange={(e) => setRest(e.target.value)}
              placeholder="나머지 주소"
              className={twMerge(input, "flex-1")}
            />
          </div>
          <button type="submit" className={btn}>
            저장
          </button>
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
