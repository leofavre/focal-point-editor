import { BrowserRouter, Route, Routes } from "react-router-dom";
import Generator from "./pages/Generator/Generator";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Generator />} />
        <Route path="/:imageId" element={<Generator />} />
      </Routes>
    </BrowserRouter>
  );
}
