import { TMDBMovie } from "@/types/tmdb";
import Image from "next/image";
import Link from "next/link";

interface MovieItemProps {
  movie: TMDBMovie; // `movie`는 prop으로 전달되어야 합니다.
}

const MovieItem = ({ movie }: MovieItemProps) => {
  return (
    <Link href={movie.id.toString()}>
      <div className=" border rounded-2xl p-2.5 border-gray-200 hover:shadow-md">
        <div className="overflow-hidden rounded-2xl hover:shadow-md hover:opacity-90">
          <Image
            alt={movie.title}
            src={`${process.env.TMDB_IMG_URL}/w500${movie.poster_path}`}
            width={180}
            height={120}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex flex-col gap-y-1 mt-2.5">
            <h2 className="font-semibold">{movie.title}</h2>

            {movie.title !== movie.original_title && (
              <p className="text-gray-500 text-xs">movie.original_title</p>
            )}
            <p className="line-clamp-3">{movie.overview}</p>
          </div>
          <div className="flex gap-x-2.5 items-center">
            <div className=" flex-1  h-4 rounded-full bg-zinc-50 flex  flex-col justify-center px-1">
              <span
                className="block h-2 rounded-full bg-yellow-200"
                style={{
                  width: `${(movie.vote_average / 10) * 100}% `,
                }}
              />
            </div>
            <p>{movie.vote_average}점</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieItem;
