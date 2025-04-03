"use client";

import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  Chart,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  ActiveElement,
  PointElement,
  LegendElement,
  registerables,
} from "chart.js";
import { Line } from "react-chartjs";
import * as Charts from "react-chartjs-2";
Chart.register(...registerables);

Chart.register(ArcElement, Tooltip, Legend);

interface WProps {
  baseDate: string;
  baseTime: string;
  category: ShortValueTarget;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

const categories: ShortCategory[] = [
  "강수확률",
  "강수형태",
  "1시간 강수량",
  "습도",
  "1시간 신적설",
  "하늘상태",
  "1시간 기온",
  "일 최저기온",
  "일 최고기온",
  "풍속(동서성분)",
  "풍속(남북성분)",
  "파고",
  "풍향",
  "풍속",
];

const WCom = (props: any | { message: string }) => {
  const [data, setData] = useState(props);
  const [category, setCategory] = useState<ShortCategory>("강수확률");

  const [items, setItems] = useState<WProps[]>([]);

  const onTest = useCallback(() => {
    // 데이터 필터링 및 최대 4개 항목만 보여주기
    const filteredItems = data.body.items.item
      .filter((item: WProps) => getShortValue(item.category) === category)
      .slice(0, 4); // 4개 항목만
    console.log(filteredItems);
    setItems(filteredItems); // 상태 업데이트
  }, [data, category]);

  useEffect(() => {
    if (data.message) {
      alert(data.message);
    } else {
      // 페이지가 로드될 때 카테고리별로 데이터를 필터링하고 최대 4개 항목만 보여주기
      const filteredItems = data.body.items.item
        .filter((item: WProps) => getShortValue(item.category) === category)
        .slice(0, 4); // 최대 4개만
      console.log(filteredItems);
      setItems(filteredItems); // 상태 업데이트
    }
  }, [data, category]);

  return (
    <div className="mt-[1px]">
      <ul className="flex overflow-x-auto">
        {categories.map((cate) => (
          <li key={cate}>
            <button
              onClick={() => setCategory(cate)}
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
      {/* <ul>
        {items.map(({ category, fcstValue, baseTime, fcstTime }, index) => (
          <li key={index}>
            [{getShortValue(category)}] - {fcstValue} ({baseTime}/예보시간:{" "}
            {fcstTime})
          </li>
        ))}
      </ul> */}
      <button onClick={onTest}>{category}</button>
      <div className="overflow-x-auto max-w-full">
        <Charts.Line
          data={{
            labels: items.map((item) => item.fcstTime),
            datasets: [
              {
                label: category,
                data: items.map((item) => item.fcstValue),
                borderWidth: 1,
                backgroundColor: "red",
                borderColor: "black",
                pointBorderColor: "yellow",
                capBezierPoints: true,
                fill: true,
                clip: 100,
                pointBorderWidth: 4,
                pointStyle: {
                  style: {
                    border: "2px solid black",
                  },
                },
              },
            ],
          }}
          style={{
            width: "200vw",
          }}
        />
      </div>
    </div>
  );
};

export default WCom;

type ShortValueTarget =
  | "POP"
  | "PTY"
  | "PCP"
  | "REH"
  | "SNO"
  | "SKY"
  | "TMP"
  | "TMN"
  | "TMX"
  | "UUU"
  | "VVV"
  | "WAV"
  | "VEC"
  | "WSD";

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

const getShortValue = (target: ShortValueTarget): ShortCategory => {
  switch (target) {
    case "POP":
      return "강수확률";
    case "PTY":
      return "강수형태";
    case "PCP":
      return "1시간 강수량";
    case "REH":
      return "습도";
    case "SNO":
      return "1시간 신적설";
    case "SKY":
      return "하늘상태";
    case "TMP":
      return "1시간 기온";
    case "TMX":
      return "일 최고기온";
    case "TMN":
      return "일 최저기온";
    case "UUU":
      return "풍속(동서성분)";
    case "VVV":
      return "풍속(남북성분)";
    case "WAV":
      return "파고";
    case "VEC":
      return "풍향";
    case "WSD":
      return "풍속";
    default:
      return "강수확률"; // default category 처리
  }
};
