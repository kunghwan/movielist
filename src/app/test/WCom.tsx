"use client";

import { twMerge } from "tailwind-merge"; //
import { useCallback, useEffect, useState } from "react";
import { Chart, registerables } from "chart.js"; // Chart.js의 필요한 컴포넌트를 임포트합니다. 이 라이브러리는 차트를 그리는데 사용됩니다.
import * as Charts from "react-chartjs-2";
Chart.register(...registerables);

interface WProps {
  baseDate: string; // 예보의 기준 날짜
  baseTime: string; // 예보의 기준 시간
  category: ShortValueTarget; // 예보의 카테고리 (예: 온도, 강수 확률 등)
  fcstDate: string; // 예보 날짜
  fcstTime: string; // 예보 시간
  fcstValue: string; // 예보 값 (실제 예측된 값)
  nx: number; // 지리적 좌표의 x값
  ny: number; // 지리적 좌표의 y값
}

const categories: ShortCategory[] = [
  // 사용자가 선택할 수 있는 날씨 카테고리 목록
  "강수확률", // 강수 확률
  "강수형태", // 강수 형태
  "1시간 강수량", // 1시간 강수량
  "습도", // 습도
  "1시간 신적설", // 1시간 신적설
  "하늘상태", // 하늘 상태
  "1시간 기온", // 1시간 기온
  "일 최저기온", // 일 최저기온
  "일 최고기온", // 일 최고기온
  "풍속(동서성분)", // 풍속 (동서 성분)
  "풍속(남북성분)", // 풍속 (남북 성분)
  "파고", // 파고
  "풍향", // 풍향
  "풍속", // 풍속
];

const WCom = (props: any | { message: string }) => {
  const [data, setData] = useState(props); // props에서 전달된 데이터를 상태로 설정
  const [category, setCategory] = useState<ShortCategory>("강수확률"); // 선택된 카테고리를 상태로 설정, 기본값은 '강수확률'
  const [items, setItems] = useState<WProps[]>([]); // 필터링된 예보 데이터를 저장할 상태

  useEffect(() => {
    if (data.message) {
      // props에서 message가 있으면 알림창을 띄웁니다.
      alert(data.message);
    } else {
      //! 데이터 가공: 선택된 카테고리에 맞는 항목만 필터링합니다.
      const copy: WProps[] = [];
      data.body.items.item.map((item: WProps) => {
        const found = getShortValue(item.category) === category; // 예보 항목의 카테고리가 선택된 카테고리와 일치하는지 확인
        if (found) {
          copy.push(item); // 일치하면 그 항목을 필터된 배열에 추가
        }
      });
      console.log(copy); // 필터된 데이터를 콘솔에 출력
      setItems(copy); // 상태를 업데이트하여 필터된 데이터를 화면에 표시
    }
  }, [data, category]); // data나 category가 변경될 때마다 이 코드가 실행됩니다.

  const onTest = useCallback(() => {
    // 데이터를 필터링하는 콜백 함수
    let totalPage = 0;
    totalPage = Math.ceil(data.body.totalCount / data.body.numOfRows); // 전체 페이지 수 계산
    const copy: WProps[] = [];
    data.body.items.item.map((item: WProps) => {
      const found = getShortValue(item.category) === category; // 선택된 카테고리와 일치하는 항목을 찾음
      if (found) {
        copy.push(item); // 일치하면 그 항목을 복사 배열에 추가
      }
    });
    console.log(copy); // 필터된 데이터를 콘솔에 출력
    setItems(copy); // 상태를 업데이트하여 필터된 데이터를 화면에 표시
  }, [data, category]); // 데이터나 카테고리가 변경될 때마다 이 콜백 함수가 다시 실행됩니다.

  return (
    <div className="mt-[1px]">
      {/* 카테고리 선택 버튼을 렌더링 */}
      <ul className="flex overflow-x-auto">
        {categories.map((cate) => (
          <li key={cate}>
            <button
              onClick={() => setCategory(cate)} // 버튼을 클릭하면 해당 카테고리로 상태를 변경
              className={twMerge(
                "min-w-25 border py-2.5 text-center cursor-pointer hover:bg-gray-50",
                cate === category &&
                  "bg-sky-500 text-white border-sky-500 hover:bg-sky-400"
              )}
            >
              {cate}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onTest}>{category}</button>{" "}
      {/* 이 버튼을 클릭하면 데이터를 필터링하는 함수가 실행됩니다 */}
      {/* 아래 코드는 예보 항목들을 리스트로 표시하는 부분인데, 주석 처리되어 있습니다. */}
      {/* <ul>
        {items.map(({ category, fcstValue, baseTime, fcstTime }, index) => (
          <li key={index}>
            [{getShortValue(category)}] - {fcstValue} ({baseTime}/예보시간: {fcstTime})
          </li>
        ))}
      </ul> */}
      {/* react-chartjs-2를 사용하여 차트를 렌더링 */}
      <Charts.Line
        data={{
          labels: items.map((item) => item.fcstTime), // 예보 시간 데이터를 x축 레이블로 설정
          datasets: [
            {
              label: category, // 선택된 카테고리를 차트 레이블로 설정
              data: items.map((item) => item.fcstValue), // 예보 값 데이터를 y축 데이터로 설정
              borderWidth: 1, // 선의 두께를 1로 설정
              fill: true, // 선 아래 영역을 채움
            },
          ],
        }}
      />
    </div>
  );
};

export default WCom;

// ShortValueTarget 타입은 예보 데이터에서 사용할 수 있는 카테고리를 정의합니다.
type ShortValueTarget =
  | "POP" // 강수 확률
  | "PTY" // 강수 형태
  | "PCP" // 1시간 강수량
  | "REH" // 습도
  | "SNO" // 1시간 신적설
  | "SKY" // 하늘 상태
  | "TMP" // 1시간 기온
  | "TMN" // 일 최저기온
  | "TMX" // 일 최고기온
  | "UUU" // 풍속 (동서 성분)
  | "VVV" // 풍속 (남북 성분)
  | "WAV" // 파고
  | "VEC" // 풍향
  | "WSD"; // 풍속

// ShortCategory 타입은 사용자에게 표시되는 날씨 카테고리 이름을 정의합니다.
type ShortCategory =
  | "강수확률"
  | "강수형태"
  | "1시간 강수량"
  | "습도"
  | "1시간 신적설"
  | "하늘상태"
  | "1시간 기온"
  | "일 최저기온"
  | "일 최고기온"
  | "풍속(동서성분)"
  | "풍속(남북성분)"
  | "파고"
  | "풍향"
  | "풍속";

// ShortValueTarget을 해당하는 ShortCategory로 매핑하는 함수
const getShortValue = (target: ShortValueTarget): ShortCategory => {
  switch (target) {
    case "POP":
      return "강수확률"; // 강수 확률
    case "PTY":
      return "강수형태"; // 강수 형태
    case "PCP":
      return "1시간 강수량"; // 1시간 강수량
    case "REH":
      return "습도"; // 습도
    case "SNO":
      return "1시간 신적설"; // 1시간 신적설
    case "SKY":
      return "하늘상태"; // 하늘 상태
    case "TMP":
      return "1시간 기온"; // 1시간 기온
    case "TMX":
      return "일 최고기온"; // 일 최고기온
    case "TMN":
      return "일 최저기온"; // 일 최저기온
    case "UUU":
      return "풍속(동서성분)"; // 풍속 (동서 성분)
    case "VVV":
      return "풍속(남북성분)"; // 풍속 (남북 성분)
    case "WAV":
      return "파고"; // 파고
    case "VEC":
      return "풍향"; // 풍향
    case "WSD":
      return "풍속"; // 풍속
  }
};
