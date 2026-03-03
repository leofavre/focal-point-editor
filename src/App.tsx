import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContext } from "./AppContext";
import { ToasterInPopover } from "./components/ToasterInPopover/ToasterInPopover";
import Layout from "./pages/Layout";

const PageContent = lazy(() =>
  import("./pages/PageContent/PageContent").then((m) => ({ default: m.PageContent })),
);

export default function App() {
  return (
    <BrowserRouter>
      <ToasterInPopover />
      <AppContext>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<PageContent />} />
            <Route path="privacy" element={<PageContent />} />
            <Route path="image/:imageId" element={<PageContent />} />
            <Route path="*" element={<PageContent />} />
          </Route>
        </Routes>
      </AppContext>
    </BrowserRouter>
  );
}
