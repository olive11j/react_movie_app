import React, { useState, useEffect } from "react";
import axios from "axios";
import "./movies.css";

const MOVIES_PER_PAGE = 6;

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("");

  const fetchTrendingMovies = async () => {
    const pageToFetch = currentPage; // Use the current page number

    try {
      const trendingResponse = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=d3f64c0d2bd542d5f7293e93d7f4ab9c&page=${pageToFetch}`
      );

      const trendingMovies = trendingResponse.data.results;

      // Sort the movies based on the selected sort order
      if (sortOrder === "ascending") {
        trendingMovies.sort((a, b) => a.vote_average - b.vote_average);
      } else if (sortOrder === "descending") {
        trendingMovies.sort((a, b) => b.vote_average - a.vote_average);
      }

      setTrendingMovies(trendingMovies);
    } catch (error) {
      // Handle any errors that may occur during the API request
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, [currentPage, sortOrder]);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=d3f64c0d2bd542d5f7293e93d7f4ab9c&language=en-US&query=${searchTerm}&page=${currentPage}`
      );

      const moviesLength = response.data.results.length;
      const start = (currentPage - 1) * MOVIES_PER_PAGE;
      const end = Math.min(start + MOVIES_PER_PAGE, moviesLength);
      let searchedMovies = response.data.results.slice(start, end);

      if (sortOrder === "ascending") {
        searchedMovies.sort((a, b) => a.vote_average - b.vote_average);
      } else if (sortOrder === "descending") {
        searchedMovies.sort((a, b) => b.vote_average - a.vote_average);
      }

      setMovies(searchedMovies);
    };

    fetchMovies();
  }, [searchTerm, currentPage, sortOrder]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // Reset the current page to 1 when performing a new search
    setCurrentPage(1);
  };

  const handlePageChange = (event) => {
    setCurrentPage(Number(event.target.value));
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const paginationButtons = [];
  const totalPageCount = 100;

  const startPage = (Math.floor((currentPage - 1) / 4) * 4) + 1;
  const endPage = Math.min(startPage + 3, totalPageCount);

  for (let i = startPage; i <= endPage; i++) {
    paginationButtons.push(
      <button
        key={i}
        value={i}
        onClick={handlePageChange}
        className={i === currentPage ? "active" : ""}
      >
        {i}
      </button>
    );
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search movies"
        onChange={handleSearch}
      />

      <div className="sort-dropdown">
        <select value={sortOrder} onChange={handleSortOrderChange}>
          <option value="">Sort by Rating</option>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </div>

      {searchTerm && (
        <div>
          <h2>Search Results</h2>
          <ul className="movie-list">
            {movies.map((movie) => (
              <li key={movie.id}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-picture"
                />
                <h3>{movie.title}</h3>
                <p className="rating">Rating: <span>{movie.vote_average || movie.rating}</span></p>
                <p>{movie.overview}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!searchTerm && (
        <div>
          <h2>Trending Movies</h2>
          <ul className="movie-list">
            {trendingMovies.map((movie) => (
              <li key={movie.id}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-picture"
                />
                <h3>{movie.title}</h3>
                <p className="rating">Rating: <span>{movie.vote_average || movie.rating}</span></p>
                <p>{movie.overview}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pagination">
        {startPage > 1 && (
          <button
            value={startPage - 1}
            onClick={handlePageChange}
            className="prev-button"
          >
            Previous
          </button>
        )}
        {paginationButtons}
        {endPage < totalPageCount && (
          <button
            value={endPage + 1}
            onClick={handlePageChange}
            className="next-button"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieList;
