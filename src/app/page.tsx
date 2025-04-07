"use client";

import { useState } from "react";
import {
  IoMdArrowDropdown,
  IoMdArrowDropup,
  IoMdCheckmark,
} from "react-icons/io";
import { twMerge } from "tailwind-merge";
import { schoolType } from "./dummy";

const page = () => {
  const [button, setButton] = useState(false);
  const [checkboxState, setCheckboxState] = useState<{
    [key: string]: boolean;
  }>(false);

  const stateChange = () => {
    setButton(true);
    setTimeout(() => {
      setButton(false);
    }, 500);
  };

  const checkboxStateChange = () => {
    setCheckboxState((prev) => !prev);
  };

  return (
    <>
      <div className="border rounded-full p-3 flex w-200 mx-auto">
        <div className="flex justify-between w-full">
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            className=" rounded-full p-4 bg-gray-100 w-100 "
          />

          <div
            className={twMerge(
              "text-center rounded-full p-4  text-white outline-none font-bold text-xl bg-amber-200 items-center flex gap-x-1.5",
              `${button ? "bg-amber-500" : ""}`
            )}
          >
            학교정보 상세검색
            <button
              className={twMerge(
                "rounded-full bg-sky-200 p-1 ",
                `${button ? "animate-spin " : ""}`
              )}
              onClick={stateChange}
            >
              {button ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </button>
          </div>
        </div>
      </div>

      {/* 항목별로 학교 고르기 */}
      <div className="border mt-2.5 w-200 mx-auto">
        유형선택
        <div className=" border-t p-2.5">
          <p>학교유형</p>
          <ul className="grid grid-cols-2 mt-2 ml-5  gap-y-1.5">
            {schoolType.map((school) => {
              return (
                <>
                  <div className="flex gap-2.5">
                    <div
                      className={twMerge(
                        "border rounded p-1 cursor-pointer",
                        `${checkboxState ? "bg-amber-400" : ""}`
                      )}
                      onClick={checkboxStateChange}
                    >
                      <IoMdCheckmark />
                    </div>
                    <li key={school}>{school}</li>
                  </div>
                </>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default page;
