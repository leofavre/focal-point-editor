import { BrowserRouter, Route, Routes } from "react-router-dom";
import Editor from "./pages/Editor/Editor";
import Landing from "./pages/Landing/Landing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/:imageId" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}
