import { BrowserRouter, Route, Routes } from "react-router-dom";
import Generator from "./pages/Generator/Generator";
import Landing from "./pages/Landing/Landing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/image/:imageId" element={<Generator />} />
      </Routes>
    </BrowserRouter>
  );
}
