import { ViteReactSSG } from "vite-react-ssg";
import type { RouteRecord } from "vite-react-ssg";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SermonsIndex from "./pages/SermonsIndex";
import SermonDetail from "./pages/SermonDetail";
import WorshipResourcesIndex from "./pages/WorshipResourcesIndex";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { getAllPosts } from "./lib/content";
import "./styles.css";

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
      { path: "*", Component: NotFound },
    ],
  },
];

export const createRoot = ViteReactSSG({ routes });
