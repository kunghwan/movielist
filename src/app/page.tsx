import { TMDBResponse } from "@/types/tmdb";
import MovieItem from "./MovieItem";

const fetchMovies = async (): Promise<TMDBResponse> => {
  const url =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };

  const res = await fetch(url, options);
  const data = await res.json();
  console.log(data);
  return data; // Return the list of movies
};

const Home = async () => {
  const movies = await fetchMovies();
  return (
    <div>
      <h1>{movies.results.length}개의 영화가 있습니다</h1>
      <p>{movies.page}번쨰 페이지</p>
      <p>tmdb에는 {movies.total_results.toLocaleString()}의 영화가 있음</p>
      <ul className="grid grid-cols-2 gap-5 px-5">
        {movies.results.map((movie) => (
          <li key={movie.id}>
            <MovieItem {...movie} movie={movie} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
