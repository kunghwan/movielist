"use client";

import { useEffect, useState } from "react";

interface WProps {
  baseDate: string;
  baseTime: string;
  fcstDate: string;
  fcstTime: string;
  category: ShortValueTarget;
  fcstValue: number;
  nx: number;
  ny: number;
}

const categories: ShortCategory[] = [];

const Weather = (props: any | { message: string }) => {
  const [data, setData] = useState(props);

  const [category, setCategory] = useState<ShortCategory>("강수확률");

  const [items, setItems] = useState<WProps[]>([]);

  useEffect(() => {
    if (data.message) {
      alert(data.message);
    } else {
      const copy: WProps[] = [];
      data.body.items.item.map((item: WProps) => {
        const found = getShortValue(item.category) === category;

        if (found) {
          copy.push(item);
        }
      });

      console.log(copy);

      setData(copy);
    }
  }, [data, category]);

  return (
    <div>
      <label htmlFor="">날씨</label>
      <input type="text" className="border" />
    </div>
  );
};

export default Weather;

type ShortValueTarget =
  | "POP"
  | "PTY"
  | "PCP"
  | "REH"
  | "SNO"
  | "SKY"
  | "TMP"
  | "TMN"
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
