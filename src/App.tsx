import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContext } from "./AppContext";
import { ToasterInPopover } from "./components/ToasterInPopover/ToasterInPopover";
import Layout from "./pages/Layout";

const LandingPage = lazy(() =>
  import("./pages/LandingPage/LandingPage").then((m) => ({ default: m.LandingPage })),
);

const EditPage = lazy(() =>
  import("./pages/EditPage/EditPage").then((m) => ({ default: m.EditPage })),
);

const PrivacyPage = lazy(() =>
  import("./pages/Privacy/Privacy").then((m) => ({ default: m.PrivacyPage })),
);

const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);

export default function App() {
  return (
    <BrowserRouter>
      <ToasterInPopover />
      <AppContext>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="image/:imageId" element={<EditPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AppContext>
    </BrowserRouter>
  );
}
