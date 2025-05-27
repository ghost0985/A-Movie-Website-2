import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../styles/Movie.css";

const OMDB_API_KEY = "e712e7eb";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;
    setLoading(true); 
    setMovie(null)
    setError("")
    setFadeIn(false)

    async function fetchMovieDetails() {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}&plot=full`
        );
        const data = await res.json();

        if (!isCancelled) {
          if (data.Response === "True") {
            setMovie(data);
            setError("");
          } else {
            setError("Movie not found.");
          }
          setFadeIn(true)
        }
      } catch (err) {
        if (!isCancelled)
          setError("Something went wrong while fetching the movie.");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchMovieDetails();

   
    return () => {
      isCancelled = true;
    };
  }, [id]);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="spinner__container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <p className="no__results">{error}</p>;
  }

  return (
    <div className={`wrapper ${fadeIn ? "fade-in" : ""}`}>
      <div className="logo">
        <div className="container">
          <p>
            <Link to="/">
              Movie<span>Gallery.</span>
            </Link>
          </p>
        </div>
      </div>
      <button onClick={handleBack} className="back-btn">
        Go Back 
      </button>

      <div className="movie-detail__container">
        <img
          className="movie__poster--detail"
          src={
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/300x450"
          }
          alt={movie.Title}
        />
        <div className="movie__info">
          <h2 className="movie__title--detail">{movie.Title}</h2>
          <p className="details"><strong>Rated:</strong> {movie.Rated}</p>
          <p className="details"><strong>Awards:</strong> {movie.Awards}</p>
          <p className="detail__year">
            <strong>Release Date:</strong> {movie.Released}
          </p>
          <p className="details">
            <strong>Run Time:</strong> {movie.Runtime}
          </p>
          <p className="details"><strong>Language:</strong> {movie.Language}</p>
          <p className="details">
            <strong>Plot:</strong> {movie.Plot}
          </p>
          <p className="details">
            <strong>Genres:</strong> {movie.Genre}
          </p>
          <p className="details">
            <strong>Director:</strong> {movie.Director}
          </p>
          <p className="details">
            <strong>Actors:</strong> {movie.Actors}
          </p>
        </div>
      </div>
    </div>
  );
}
