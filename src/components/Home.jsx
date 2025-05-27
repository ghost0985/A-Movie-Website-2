import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();
  const [movieName, setMovieName] = React.useState("");

  function goToSearchPage(e) {
    if (e.key === "Enter") {
      if (movieName !== "") {
        navigate("/search", {
          state: {
            query: movieName,
          },
        });
      }
    }
  }

  function handleInputChange(event) {
    setMovieName(event.target.value);
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Welcome to Movie Gallery 🎥</h1>
        <p>Type a movie name and hit enter</p>
        <input
          className="home-search-box"
          placeholder="Type movie here..."
          value={movieName}
          onChange={handleInputChange}
          onKeyDown={goToSearchPage}
        />
      </div>
    </div>
  );
}

export default Home;
