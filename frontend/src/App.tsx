import { type ReactElement } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ThemeProvider } from "./store/ThemeContext";
import "./App.css";

function App(): ReactElement {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
