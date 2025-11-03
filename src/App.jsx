import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./componets/Login";
import Registro from "./componets/Registro";
import Home from "./componets/Home";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
