import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import WelcomePage from "./pages/Welcome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <WelcomePage />,
      },
    ],
  },
]);

export default router;
