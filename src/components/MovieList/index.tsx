"use client";
import { use, useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../MovieCard";
import { Movie } from "@/types/movie";
import "./styles.scss";
import ReactLoading from 'react-loading';




export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = async () => {
   await axios({
      method: "get",
      url: "https://api.themoviedb.org/3/discover/movie",
      params: {
        api_key: "42710b83fd875aa0d8ed72c433fbc281",
        language: "pt-BR",
      },
    }).then((response) => {
      setMovies(response.data.results);
    });
    setIsLoading(false);
  };

  if (isloading) {
    return (
      <div className="container-loading">
        <ReactLoading type={'spin'} color={'#fff'} height={'5%'} width={'5%'} />
      </div>
    );
  }

  return (
    <div>
      <ul className="movie-list">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ul>
    </div>
  );
}
