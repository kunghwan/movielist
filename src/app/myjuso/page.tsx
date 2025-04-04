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
  const [keyword, setKeyword] = useState("");
  const [isShowing, setIsShowing] = useState(false);

  const [juso, setJuso] = useState<JusoProps | null>(null);
  const [rest, setRest] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [items, setItems] = useState<JusoProps[]>([]);

  const keywordRef = useRef<HTMLInputElement>(null);
  const restRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();

  const onSubmit = useCallback(
    (pageNo: number) => {
      if (keyword.length === 0) {
        alert("검색어를 입력해주세요.");
        return keywordRef.current?.focus();
      }
      startTransition(async () => {
        const url = `/api/v1/test/juso?pageNo=${pageNo}`;
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
      {isPending && <RootLoading />}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(currentPage);
        }}
        className=" "
      >
        <div className="flex gap-x-2.5 mx-auto">
          <input
            type="text"
            className="border p-2.5 rounded bg-gray-100 border-gray-200"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="대전 동구"
            ref={keywordRef}
            id="keyword"
          />
          <button className="border  p-3 rounded bg-amber-400 text-white text-2xl">
            <AiOutlineSearch />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Juso;

const input =
  "border border-gray-200 bg-gray-50 outline-none focus:border-sky-500 h-12 rounded focus:bg-transparent px-2.5 w-full";

const btn =
  "rounded cursor-pointer bg-sky-500 text-white flex justify-center items-center size-12";
