import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Movies from './Movies';
import Movie from './Movie';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/movies/:id" element={<Movie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
