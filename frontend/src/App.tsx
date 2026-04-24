import { type ReactElement } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ThemeProvider } from "./store/ThemeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./App.css";

function App(): ReactElement {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
