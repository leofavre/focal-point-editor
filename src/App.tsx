import { lazy } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContext } from "./AppContext";
import Layout from "./pages/Layout";

const Landing = lazy(() => import("./pages/Landing/Landing").then((m) => ({ default: m.Landing })));

const Editor = lazy(() => import("./pages/Editor/Editor").then((m) => ({ default: m.Editor })));

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <AppContext>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path=":imageId" element={<Editor />} />
          </Route>
        </Routes>
      </AppContext>
    </BrowserRouter>
  );
}
