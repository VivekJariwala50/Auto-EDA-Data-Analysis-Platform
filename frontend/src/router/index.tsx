import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { lazy, Suspense, type ReactNode, type FC } from "react";
import { RouteErrorPage } from "../components/ErrorBoundary";

const Loader = () => (
  <div style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
  }}>
    <div style={{
      width: 32,
      height: 32,
      border: "3px solid var(--border)",
      borderTopColor: "var(--brand)",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const withSuspense = (Component: React.LazyExoticComponent<FC>): ReactNode => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

const Home: React.LazyExoticComponent<FC> = lazy(() => import("../pages/Home"));
const Dashboard: React.LazyExoticComponent<FC> = lazy(() => import("../pages/Dashboard"));

const routes: RouteObject[] = [
  {
    id: "home",
    path: "/",
    element: withSuspense(Home),
    errorElement: <RouteErrorPage />,
  },
  {
    id: "dashboard",
    path: "/dashboard",
    element: withSuspense(Dashboard),
    errorElement: <RouteErrorPage />,
  },
];

export const router = createBrowserRouter(routes);
