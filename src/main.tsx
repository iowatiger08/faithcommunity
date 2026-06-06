import { ViteReactSSG } from "vite-react-ssg";
import type { RouteRecord } from "vite-react-ssg";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SermonsIndex from "./pages/SermonsIndex";
import SermonDetail from "./pages/SermonDetail";
import WorshipResourcesIndex from "./pages/WorshipResourcesIndex";
import About from "./pages/About";
import Care from "./pages/Care";
import Give from "./pages/Give";
import Subscribe from "./pages/Subscribe";
import Publications from "./pages/Publications";
import Ordination from "./pages/Ordination";
import Meditations from "./pages/Meditations";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import { getAllPosts } from "./lib/content";
import { currentSeason } from "./lib/liturgical";
import "./styles.css";

// Apply the liturgical theme as early as possible. Client-only — `document`
// doesn't exist during SSG — and it sets an attribute outside React's tree, so
// there's no hydration mismatch. Runs before hydration to keep first paint
// on-season. The theme then naturally tracks the date on every visit.
if (typeof document !== "undefined") {
  document.documentElement.dataset.season = currentSeason().key;
}

const routes: RouteRecord[] = [
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "sermons", Component: SermonsIndex },
      {
        path: "sermons/:slug",
        Component: SermonDetail,
        getStaticPaths: () =>
          getAllPosts()
            .filter((p) => p.section === "sermons")
            .map((p) => `/sermons/${p.slug}`),
      },
      { path: "worship-resources", Component: WorshipResourcesIndex },
      {
        path: "worship-resources/:slug",
        Component: SermonDetail,
        getStaticPaths: () =>
          getAllPosts()
            .filter((p) => p.section === "worship_resources")
            .map((p) => `/worship-resources/${p.slug}`),
      },
      { path: "about", Component: About },
      { path: "care", Component: Care },
      { path: "give", Component: Give },
      { path: "subscribe", Component: Subscribe },
      { path: "publications", Component: Publications },
      { path: "ordination", Component: Ordination },
      { path: "meditations", Component: Meditations },
      { path: "terms", Component: Terms },
      { path: "*", Component: NotFound },
    ],
  },
];

export const createRoot = ViteReactSSG({ routes });
