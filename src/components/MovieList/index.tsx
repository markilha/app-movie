"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import MovieCard from "../MovieCard";
import { Movie } from "@/types/movie";
import "./styles.scss";
import ReactLoading from 'react-loading';

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const lastUserRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {   
    getMovies(page);

    if (isSearching) return;

    observer.current = new IntersectionObserver((entries) => {
      const lastEntry = entries[entries.length - 1];
      if (lastEntry.isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (lastUserRef.current) {
      observer.current.observe(lastUserRef.current);
    }

    return () => {
      if (lastUserRef.current && observer.current) {
        observer.current.unobserve(lastUserRef.current);
      }
    };
  }, [movies, hasMore, isSearching]);

  useEffect(() => {
    if (page > 1) {
      getMovies(page);
    }
  }, [page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length === 0) {
        setIsSearching(false);
        setPage(1);
        setHasMore(true);
        getMovies(1);
      } else {
        setIsSearching(true);
        const results = await searchMovie(query);
        setMovies(results);      
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const getMovies = async (page: number) => {
    if (isSearching) return;

    try {
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: "42710b83fd875aa0d8ed72c433fbc281",
          language: "pt-BR",
          page: page,
          sort_by: "popularity.desc",
        },
      });

      const data = response.data.results;
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prevMovies) => {
          const uniqueMovies = data.filter(movie => !prevMovies?.some(m => m.id === movie.id));
          return [...prevMovies, ...uniqueMovies];
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error.message);
      setIsLoading(false);
    }
  };

  const searchMovie = async (query) => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: "42710b83fd875aa0d8ed72c433fbc281",
          query: query,
          language: 'pt-BR', 
        },
      });

      const movies = response.data.results;
      return movies;

    } catch (error) {
      console.error('Erro ao buscar filmes:', error.message);
      return [];
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setIsSearching(true);
    setMovies([]);
    setPage(1);
    setHasMore(true);
    const results = await searchMovie(query);
    setMovies(results);
    if (query.length === 0) {
      setIsSearching(false);
      setPage(1);
    setHasMore(true);
    }
  };



  if (isLoading) {
    return (
      <div className="container-loading">
        <ReactLoading type={'spin'} color={'#fff'} height={'5%'} width={'5%'} />
      </div>
    );
  }

  return (
    <div>
      <div className=" flex w-full justify-end mr-50 mt-10">

      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Buscar filme..."
          className=" rounded-l-lg p-1 border-lime-400 border-2 bg-black text-white"
        />
        <button className=" rounded-r-lg p-1 bg-lime-400  border-lime-400 border-2" type="submit">Buscar</button>      
      </form>
      </div>
      <div>
        <ul className="movie-list">
          {movies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </ul>
        {hasMore && !isSearching && <div ref={lastUserRef}>Carregando</div>}
      </div>
    </div>
  );
}
