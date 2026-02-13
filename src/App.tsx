import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContext } from "./AppContext";
import { EditorImage } from "./pages/EditorImage";
import { Landing } from "./pages/Landing/Landing";
import Layout from "./pages/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <AppContext>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path=":imageId" element={<EditorImage />} />
          </Route>
        </Routes>
      </AppContext>
    </BrowserRouter>
  );
}
