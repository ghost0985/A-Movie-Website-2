import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
  Link,
} from "react-router-dom";
import "../styles/Movie.css";

const OMDB_API_KEY = "e712e7eb";

export default function MovieSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const queryFromUrl = searchParams.get("q") || "";
  const queryFromState = location.state?.query || "";

  const [userTypedInput, setUserTypedInput] = useState(queryFromState || queryFromUrl);
  const [theMovieList, setTheMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(true);
  const [pageFade, setPageFade] = useState(false);
  const [sortChoice, setSortChoice] = useState("");

  useEffect(() => {
    let activeQuery = queryFromState || queryFromUrl;

    if (activeQuery !== "") {
      getMoviesFromApi(activeQuery);
    } else {
      setLoadingSpinner(false);
    }
  }, [queryFromState, queryFromUrl]);

  useEffect(() => {
    setTimeout(() => {
      setPageFade(true);
    }, 100);
  }, []);

  async function getMoviesFromApi(searchTerm) {
    if (searchTerm.length < 3) {
      setErrorMessage("Please type at least 3 characters.");
      setTheMovieList([]);
      return;
    }

    setLoadingSpinner(true);
    setErrorMessage("");

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${searchTerm}&page=1`
      );
      const data = await res.json();

      setTimeout(() => {
        if (data.Response === "True") {
          setTheMovieList(data.Search);
        } else {
          setTheMovieList([]);
          setErrorMessage(data.Error || "Nothing found.");
        }
        setLoadingSpinner(false);
      }, 300); 
    } catch (error) {
      console.log("There was an error", error);
      setTimeout(() => {
        setErrorMessage("Something went wrong.");
        setLoadingSpinner(false);
      }, 300);
    }
  }

  function whenUserPressesEnter(e) {
    if (e.key === "Enter") {
      const cleanedInput = userTypedInput.trim();

      if (cleanedInput.length < 3) {
        setErrorMessage("Please type at least 3 characters.");
        setTheMovieList([]);
        return;
      }

      setErrorMessage("");
      getMoviesFromApi(cleanedInput);
      navigate(`/search?q=${encodeURIComponent(cleanedInput)}`, {
        state: { query: cleanedInput },
      });
    }
  }

  function clickToViewDetails(movieId) {
    navigate(`/movie/${movieId}`, {
      state: { query: userTypedInput },
    });
  }

  function sortMovieListBy(type) {
    const sortedMovies = [...theMovieList];

    if (type === "az") {
      sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (type === "za") {
      sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
    } else if (type === "newest") {
      sortedMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    } else if (type === "oldest") {
      sortedMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
    }

    setTheMovieList(sortedMovies);
    setSortChoice(type);
  }

  return (
    <div className={`wrapper ${pageFade ? "fade-in" : ""}`}>
      {loadingSpinner ? (
        <div className="spinner__container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="logo">
            <div className="container">
              <p>
                <Link to="/">
                  Movie<span>Gallery.</span>
                </Link>
              </p>
            </div>
          </div>

          <div className="search__container">
            <div className="searchELM">
              <h3>Search Results for: {userTypedInput}</h3>
              <input
                className="search__box"
                type="text"
                placeholder="Search Movies"
                value={userTypedInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setUserTypedInput(val);

                  if (val.length >= 3) {
                    setErrorMessage("");
                  }
                }}
                onKeyDown={whenUserPressesEnter}
              />

              <select
                className="filter__select"
                value={sortChoice}
                onChange={(e) => sortMovieListBy(e.target.value)}
              >
                <option value="">--Sort Results--</option>
                <option value="az">Title (A-Z)</option>
                <option value="za">Title (Z-A)</option>
                <option value="newest">Year (Newest-Oldest)</option>
                <option value="oldest">Year (Oldest-Newest)</option>
              </select>
            </div>
          </div>

          <div id="results">
            {errorMessage && (
              <p className="no__results">{errorMessage}</p>
            )}

            {theMovieList.map((movie) => (
              <div
                key={movie.imdbID}
                className="movie__card"
                onClick={() => clickToViewDetails(movie.imdbID)}
              >
                <img
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "https://via.placeholder.com/100x150"
                  }
                  alt={movie.Title}
                  className="movie__poster"
                />
                <div className="movie__info">
                  <strong className="movie__title">{movie.Title}</strong>
                  <span className="movie__year">({movie.Year})</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

