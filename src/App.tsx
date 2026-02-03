import { BrowserRouter, Route, Routes } from "react-router-dom";
import Editor from "./pages/Editor";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/:imageId" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}
