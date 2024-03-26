import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import IsGuest from "./middleware/auth/IsGuest";
import RequireAuth from "./middleware/auth/RequireAuth";
import WelcomePage from "./pages/Welcome";
import LoginPage from "./pages/auth/Login";
import SignupPage from "./pages/auth/Signup";
import ErrorIndexPage from "./pages/errors/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorIndexPage />,
    children: [
      {
        index: true,
        element: (
          <RequireAuth>
            <WelcomePage />
          </RequireAuth>
        ),
      },
      {
        path: "login",
        element: (
          <IsGuest>
            <LoginPage />
          </IsGuest>
        ),
      },
      {
        path: "signup",
        element: (
          <IsGuest>
            <SignupPage />
          </IsGuest>
        ),
      },
    ],
  },
]);

export default router;
