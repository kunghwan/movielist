"use client";

//Todo
// 1. api/v1/juso/route.ts
// 2. juso 검색 기능 구현
// 2-1. keyword,pageNo// currentPage => dynamic 받아와서 구현
// 2-2. client에서 키워드와 커런트 페이지를 어떻게 전달할지에 대한 전략을 수립
//! a. post method로 전달, body => keyword 넣기
//! b. searchParams로 전달, ?이름=값

// 3. 주소 검색창 구현
// 4. 받아온 주소들 map으로 구현
// 5. pagination 구현
// 6. 나머지 주소 입력 구현

const page = () => {
  return (
    <div>
      <h1>page</h1>
    </div>
  );
};

export default page;
