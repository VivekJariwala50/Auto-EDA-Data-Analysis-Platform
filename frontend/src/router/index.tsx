import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { lazy, Suspense, type ReactNode, type FC } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const withSuspense = (Component: React.LazyExoticComponent<FC>): ReactNode => {
  return (
    <Suspense
      fallback={
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      }
    >
      <Component />
    </Suspense>
  );
};

const Home: React.LazyExoticComponent<FC> = lazy(() => import("../pages/Home"));
const Dashboard: React.LazyExoticComponent<FC> = lazy(
  () => import("../pages/Dashboard"),
);

const routes: RouteObject[] = [
  {
    id: "home",
    path: "/",
    element: withSuspense(Home),
  },
  {
    id: "dashboard",
    path: "/dashboard",
    element: withSuspense(Dashboard),
  },
];

export const router = createBrowserRouter(routes);
