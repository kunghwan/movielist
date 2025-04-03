const fetchAnimals = async () => {
  const url =
    "https://data.mafra.go.kr/opendata/data/indexOpenDataDetail.do?data_id=20210806000000001532&TYPE=JSON";

  const res = await fetch(url);
  console.log(res, 5);
};

const page = () => {
  return (
    <div>
      <h1>page</h1>
    </div>
  );
};

export default page;
