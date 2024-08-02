import { Movie } from "@/types/movie";
import StarRaging from "../StarRaging";
import "./styles.scss";

export interface Props {
  movie: Movie;
}

export default function MovieCard(props: Props) {
  return (
    <li className="movie-card">
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/original/${props.movie.poster_path}`}
          alt={props.movie.title}
        />
      </div>
      <div className="movie-infos">
        <p className="movie-title">{props.movie.title}</p>
        {props.movie.vote_average > 0 &&(

        <StarRaging rating={props.movie.vote_average} />
        )}

        <div className="hidden-content">
          {props.movie.overview && (
            <p className="text-[#fff000] text-[10px]">
              {props.movie.overview.length > 50
                ? `${props.movie.overview.substring(0, 100)}...`
                : props.movie.overview}
            </p>
          )}
          <button className=" bg-[#6046ff] w-full cursor-pointer rounded-[4px] text-[12px] px-2 mb-2">Ver mais</button>
        </div>
      </div>
    </li>
  );
}
