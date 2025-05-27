import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import MovieSearch from "./components/MovieSearch";
import MovieDetail from "./components/MovieDetail";

export default function App() {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<MovieSearch />} />
      <Route
        path="/movie/:id"
        element={<MovieDetail />}
      />
    </Routes>
  );
}
