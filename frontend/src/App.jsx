
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Register from "./pages/RegisterTemp";
import Login from "./pages/LoginTemp";
import Posts from "./pages/Posts";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;