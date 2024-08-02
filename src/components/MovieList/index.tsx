"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import MovieCard from "../MovieCard";
import { Movie } from "@/types/movie";
import "./styles.scss";
import ReactLoading from 'react-loading';




export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(true); 
  const [page, setPage] = useState<string>("1");
  const [hasMore, setHasMore] = useState<boolean>(true);

  const lastUserRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>(null);
 
  

  useEffect(() => {
    getMovies(page);
    observer.current = new IntersectionObserver((entries) => {
     const lastEntry = entries[entries.length - 1];
     if(lastEntry.isIntersecting){
       setPage((prev) => String(Number(prev) + 1));
       getMovies(page);
     }
    });

    if (lastUserRef.current) {
      observer.current.observe(lastUserRef.current);
    }

    return () => {
     if(lastUserRef.current && observer.current){
      observer.current.unobserve(lastUserRef.current);
     }
    };

  }, [movies,hasMore]);
  // https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc

  const getMovies = async (page:string) => {
   await axios({
      method: "get",
      url: "https://api.themoviedb.org/3/discover/movie",
      params: {
        api_key: "42710b83fd875aa0d8ed72c433fbc281",
        language: "pt-BR",
        page: page,
        sort_by:"popularity.desc",
       
      },
    }).then((response) => {
      const data = response.data.results;
      if(data.length === 0){
        setHasMore(false);
      }else{
        setMovies([...movies, ...data]);
        setPage(page => String(Number(page) + 1));
      }
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
      <div ref={lastUserRef}>Carregando</div>
    </div>
  );
}
