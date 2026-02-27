import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Services } from "./pages/Services";
import { Community } from "./pages/Community";
import { Diagnose } from "./pages/Diagnose";
import { Pricing } from "./pages/Pricing";
import { ServiceDetail } from "./pages/ServiceDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "services", Component: Services },
      { path: "services/:id", Component: ServiceDetail },
      { path: "community", Component: Community },
      { path: "diagnose", Component: Diagnose },
      { path: "pricing", Component: Pricing },
    ],
  },
]);
