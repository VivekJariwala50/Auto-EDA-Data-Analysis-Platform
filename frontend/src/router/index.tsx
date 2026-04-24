import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { lazy, Suspense, type ReactNode, type FC } from "react";
import { RouteErrorPage } from "../components/ErrorBoundary";

import { Skeleton, Space } from "antd";

const Loader = () => (
  <div style={{
    minHeight: "100vh",
    padding: "2rem",
    background: "var(--bg)",
  }}>
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Skeleton active avatar paragraph={{ rows: 2 }} />
      <Skeleton active paragraph={{ rows: 6 }} />
      <Skeleton active paragraph={{ rows: 4 }} />
    </Space>
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
