// types/tmdb.ts
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  backdrop_path: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
  popularity: number;
}

export interface TMDBResponse {
  results: TMDBMovie[];
  total_results: number;
  total_pages: number;
  page: number;
}
