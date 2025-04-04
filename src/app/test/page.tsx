// 외부 컴포넌트를 임포트
import WCom from "./WCom";

// 비동기 함수 onLoad 정의
// 이 함수는 데이터를 API에서 로드하고, 로딩이 성공하면 해당 데이터를 반환합니다.
// 실패 시 에러 메시지를 반환합니다.
const onLoad = async (): Promise<any | { message: string }> => {
  // 환경 변수에서 API URL을 가져와 해당 URL로 API 요청을 보냄
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/v0/test`);

  // API 응답 상태가 성공적이지 않으면 에러를 출력하고, 에러 메시지를 반환
  if (!res.ok) {
    console.log("error:", res.statusText, 7); // 콘솔에 에러 메시지 출력 (7은 디버깅용 숫자)
    return { message: res.statusText }; // 에러 상태를 가진 객체 반환
  }

  // 응답이 성공적이면, JSON 형식으로 응답 데이터를 파싱
  const data = await res.json();

  // 파싱된 데이터를 반환
  return data;
};
//! 파싱 : 주어진 데이터를 분석하고 해석하여 의미 있는 구조로 변환하는 과정

// TestPage 컴포넌트 정의
// 이 컴포넌트는 onLoad 함수를 호출하여 데이터를 로드하고, 그 데이터를 WCom 컴포넌트에 전달
const TestPage = async () => {
  const data = await onLoad(); // onLoad 함수 호출하여 데이터 로드
  return <WCom {...data} />; // 로드된 데이터를 WCom 컴포넌트에 props로 전달하여 렌더링
};

// 이 컴포넌트를 다른 파일에서 사용할 수 있도록 기본 내보내기
export default TestPage;
